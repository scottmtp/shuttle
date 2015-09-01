import _ from 'lodash';
import SocketIoClient from 'socket.io-client';
import PouchDB from 'pouchdb';
import replicationStream from 'pouchdb-replication-stream';
import stream from 'stream';
import concat from 'concat-stream';

import Debug from 'debug';
let debug = new Debug('shuttle');
if (process.env.NODE_ENV === 'development') {
  localStorage.debug = 'shuttle*';
}

import NavViewActions from './NavViewActions';
import ProjectActions from './Project/ProjectActions';
import ProjectViewActions from './Project/ProjectViewActions';
import ListViewActions from './List/ListViewActions';

let signallerHost = process.env.API_URL;
let replicationOpts = {batchSize: 1};

export default class Replicator {
  constructor(project, host, key, replicationOptions) {
    this.host = host;
    this.key = key;
    this.project = project;
    this.replicationOptions = replicationOptions;

    this.connect = this.connect.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleCount = this.handleCount.bind(this);
    this.handleReceivePouchData = this.handleReceivePouchData.bind(this);
    this.sendPouchData = this.sendPouchData.bind(this);

    PouchDB.plugin(replicationStream.plugin);
    PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
  }

  handleConnect() {
    debug('handleConnect...');
  }

  handleDisconnect() {
    debug('handleDisconnect');
  }

  handleError(err) {
    debug('handleError: ' + err);
  }

  handleCount(data) {
    if (data.count > 1) {
      this.sendPouchData();
    }
  }

  _createStream(data) {
    let s = new stream.Readable();
    s._read = function() {};
    s.push(data);
    s.push(null);

    return s;
  }

  handleReceivePouchData(data) {
    debug('handleReceivePouchData...');
    let db = PouchDB(this.project.dbname);
    let s = this._createStream(data.data);

    db.load(s, this.replicationOptions)
      .then(res => {
        ProjectActions.receivedData(this.project);
        Replicator.updateUi(this.project);
      });
  }

  sendPouchData() {
    debug('sendPouchData...');
    let database = '';
    let concatStream = concat({encoding: 'string'}, function (line) {
      database += line;
    });

    let db = PouchDB(this.project.dbname);

    let self = this;
    db.dump(concatStream)
      .then(function() {
        self.socket.emit('pouchrepl', {data: database});
      });
  }

  connect() {
    let socketUrl = this.host + '/?token=' + this.key;
    debug('connect...' + socketUrl);
    this.socket = SocketIoClient(socketUrl);
    this.socket.on('connect', this.handleConnect);
    this.socket.on('error', this.handleError);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('count', this.handleCount);
    this.socket.on('pouchrepl', this.handleReceivePouchData);
  }
}

let replicators = [];

Replicator.getGroupId = function(hashUrl) {
  let groupResult = hashUrl.match(/group\/([a-zA-Z0-9\-]+)\//);
  if (groupResult) {
    return groupResult[1];
  }
};

Replicator.getListId = function(hashUrl) {
  let listResult = hashUrl.match(/list\/([a-zA-Z0-9\-]+)/);
  if (listResult) {
    return listResult[1];
  }
};

Replicator.getReplicator = function(project) {
  for (let x = 0; x < replicators.length; x++) {
    if (replicators[x].project.dbname === project.dbname) {
      return replicators[x];
    }
  }

  return false;
};

Replicator._updateUi = function(project) {
  // TODO: this is a big kludge, not sure of best way for updating UI
  try {
    let hashGroupId = Replicator.getGroupId(window.location.hash);
    if (hashGroupId === project._id) {
      let hashListId = Replicator.getListId(window.location.hash);
      if (hashListId) {
        ListViewActions.getListItems(hashGroupId, hashListId);
      } else {
        // TODO: Disabling live note updates for now. We should probably
        // investigate OT or CRDT algorithms instead of PouchDB replication

        // let noteResult = window.location.hash.match(/note\/([a-zA-Z0-9\-]+)/);
        // if (noteResult) {
        //   NoteViewActions.getNote(groupResult[1], noteResult[1]);
        // }
      }
    } else {
      ProjectViewActions.getProjects();
    }
  } catch(err) {
    console.log('error: ' + err);
  }

  NavViewActions.update();
};

Replicator.updateUi = _.throttle(Replicator._updateUi, 1000);

Replicator.updateForProject = function(project) {
  let repl = Replicator.getReplicator(project);
  if (repl) {
    repl.replicator.sendPouchData();
  } else {
    debug('Unable to update project: ' + JSON.stringify(project));
  }
};

Replicator.addProject = function(project) {
  if (!Replicator.getReplicator(project)) {
    let rep = new Replicator(project, signallerHost, project.room, replicationOpts);
    rep.connect();

    replicators.push({
      project: project,
      replicator: rep
    });
  }
};

Replicator.update = function(projects) {
  for (let x = 0; x < projects.length; x++) {
    let p = projects[x];
    if (p && p.room) {
      debug('adding project to replication: ' + JSON.stringify(p));
      Replicator.addProject(p);
    }
  }
};
