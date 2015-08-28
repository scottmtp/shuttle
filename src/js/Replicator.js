import SocketIoClient from 'socket.io-client';
import PouchDB from 'pouchdb';
import replicationStream from 'pouchdb-replication-stream';
import stream from 'stream';
import concat from 'concat-stream';

import Debug from 'debug';
let debug = Debug('shuttle');
localStorage.debug='shuttle';

import DbApi from './DbApi';
import ProjectActions from './Project/ProjectActions';

let host = 'http://localhost:3000';
let replicationOptions = {batchSize: 1};

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
        self.socket.emit('pouchrepl', {data: database})
      });
  }

  connect() {
    debug('connect...');
    this.socket = SocketIoClient(this.host + '/?token=' + this.key);
    this.socket.on('connect', this.handleConnect);
    this.socket.on('error', this.handleError);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('count', this.handleCount);
    this.socket.on('pouchrepl', this.handleReceivePouchData);
  }
}

let replicators = [];

Replicator.getReplicator = function(project) {
  for (let x = 0; x < replicators.length; x++) {
    if (replicators[x].project.dbname === project.dbname) {
      return replicators[x];
    }
  }

  return false;
};

Replicator.updateForProjectById = function(projectId) {
  dbApi.getGroup(projectId)
    .then(project => {
      Replicator.updateForProject(project);
    });
};

Replicator.updateForProject = function(project) {
  let repl = Replicator.getReplicator(project);
  if (repl) {
    repl.sendPouchData();
  } else {
    debug('Unable to update project: ' + JSON.stringify(project));
  }
};

Replicator.update = function(projects) {
  for (let x = 0; x < projects.length; x++) {
    let p = projects[x];
    if (p && p.room && !Replicator.getReplicator(p)) {
      debug('adding project to replication: ' + JSON.stringify(p));
      let rep = new Replicator(p, host, p.room, replicationOptions)
      rep.connect();

      replicators.push({
        project: p,
        replicator: rep
      });
    }
  }
};
