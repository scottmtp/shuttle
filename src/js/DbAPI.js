import PouchDB from 'pouchdb';
import nodeDebug from 'debug';
let debug = nodeDebug('shuttle:dbapi');

import DbTypes from './DbTypes';
import Replicator from './Replicator';

let componentSort = (a, b) => a.title > b.title ? 1 : -1;

window.PouchDB = PouchDB;
let dbs = new Map();

var isFirefox = function() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};

var getPouchOpts = function() {
  var opts = {};
  if(process.env.NODE_ENV === 'production' && isFirefox()) {
    opts.storage = 'persistent';
  }

  if (global.pouch_adapter) {
    opts.adapter = global.pouch_adapter;
  }

  return opts;
};

// Use the global database
var selectGlobalDB = function() {
  debug('Selecting global database.');

  if (dbs.has(DbTypes.GLOBAL_DB)) {
    return dbs.get(DbTypes.GLOBAL_DB);
  }

  var opts = getPouchOpts();
  var db = new PouchDB(DbTypes.GLOBAL_DB, opts);
  dbs.set(DbTypes.GLOBAL_DB, db);

  return db;
};

// Use a project database
var selectProjectDB = function(dbName) {
  debug('selectProjectDB db: ' + dbName);

  if (dbs.has(dbName)) {
    return dbs.get(dbName);
  }

  var opts = getPouchOpts();
  var db = new PouchDB(dbName, opts);
  dbs.set(dbName, db);

  return db;
};

//
// Generic API
//

// Destroy database
var destroyDb = function(dbName) {
  debug('destroyDb: ' + dbName);

  let dbToDestroy = new PouchDB(dbName);
  return dbToDestroy.destroy();
};

// Find one object
var getObject = function(db, collection, id, options) {
  debug('getObject: ' + collection + ', ' + id);
  return db.get(id)
    .catch(function(err) {
      if (err.status !== 404) {
        throw (err);
      }
    });
};

// Get all objects
var getAllObjects = function(db, collection) {
  debug('getAllObjects: ' + collection);

  return db.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    debug('getAllObjects results: ' + JSON.stringify(result));
    var docs = result.rows
      .map(it => it['doc'])
      .filter(it => it.type === collection);

    debug('getAllObjects filtered: ' + JSON.stringify(docs));
    return docs;
  });
};

// Update or insert object
var updateObject = function(db, collection, obj) {
  debug('updateObject: ' + collection + ', ' + JSON.stringify(obj));
  obj.type = collection;
  return db.put(obj);
};

// Delete object
var removeObject = function(db, collection, id, options) {
  debug('removeObject: ' + collection + ', ' + id);
  return db.get(id).then(function(doc) {
    return db.remove(doc);
  });
};

//
// Group API
//
var getGroup = function(id) {
  var db = selectGlobalDB();
  return getObject(db, DbTypes.TYPE_GROUP, id);
};

var getAllGroups = function() {
  var db = selectGlobalDB();
  return getAllObjects(db, DbTypes.TYPE_GROUP);
};

var updateGroup = function(obj) {
  var db = selectGlobalDB();
  return updateObject(db, DbTypes.TYPE_GROUP, obj);
};

var removeGroup = function(id) {
  var db = selectGlobalDB();
  return removeObject(db, DbTypes.TYPE_GROUP, id);
};

//
// Preference API
//
var getPreference = function(id) {
  var db = selectGlobalDB();
  return getObject(db, DbTypes.TYPE_PREFERENCE, id);
};

var getAllPreferences = function() {
  var db = selectGlobalDB();
  return getAllObjects(db, DbTypes.TYPE_PREFERENCE);
};

var updatePreference = function(obj) {
  var db = selectGlobalDB();
  return updateObject(db, DbTypes.TYPE_PREFERENCE, obj);
};

var removePreference = function(id) {
  var db = selectGlobalDB();
  return removeObject(db, DbTypes.TYPE_PREFERENCE, id);
};

//
// Settings API
//
var getSetting = function(project, id) {
  var db = selectProjectDB(project.dbname);
  return getObject(db, DbTypes.TYPE_SETTING, id);
};

var getAllSettings = function(project) {
  var db = selectProjectDB(project.dbname);
  return getAllObjects(db, DbTypes.TYPE_SETTING);
};

var updateSetting = function(project, obj) {
  var db = selectProjectDB(project.dbname);
  return updateObject(db, DbTypes.TYPE_SETTING, obj);
};

var removeSetting = function(project, id) {
  var db = selectProjectDB(project.dbname);
  return removeObject(db, DbTypes.TYPE_SETTING, id);
};

//
// Note API
//
var getNote = function(project, id, options) {
  var db = selectProjectDB(project.dbname);
  return getObject(db, DbTypes.TYPE_NOTE, id, options);
};

var getAllNotes = function(project) {
  var db = selectProjectDB(project.dbname);
  return getAllObjects(db, DbTypes.TYPE_NOTE);
};

var updateNote = function(project, obj) {
  var db = selectProjectDB(project.dbname);
  return updateObject(db, DbTypes.TYPE_NOTE, obj)
    .then((res) => {
      if (project.room) {
        Replicator.updateForProject(project, 1);
      }
      return res;
    });
};

var removeNote = function(project, id, options) {
  var db = selectProjectDB(project.dbname);
  return removeObject(db, DbTypes.TYPE_NOTE, id, options)
    .then((res) => {
      if (project.room) {
        Replicator.updateForProject(project, 1);
      }
      return res;
    });
};

//
// List API
//
var getList = function(project, id, options) {
  var db = selectProjectDB(project.dbname);
  return getObject(db, DbTypes.TYPE_LIST, id, options);
};

var getAllLists = function(project) {
  var db = selectProjectDB(project.dbname);
  return getAllObjects(db, DbTypes.TYPE_LIST);
};

var updateList = function(project, obj) {
  var db = selectProjectDB(project.dbname);
  return updateObject(db, DbTypes.TYPE_LIST, obj)
    .then((res) => {
      if (project.room) {
        Replicator.updateForProject(project, 1);
      }
      return res;
    });
};

var removeList = function(project, id, options) {
  var db = selectProjectDB(project.dbname);
  return removeObject(db, DbTypes.TYPE_LIST, id, options)
    .then((res) => {
      if (project.room) {
        Replicator.updateForProject(project, 1);
      }
      return res;
    });
};

//
// List Item API
//
var getListItem = function(project, id, options) {
  var db = selectProjectDB(project.dbname);
  return getObject(db, DbTypes.TYPE_LIST_ITEM, id, options);
};

var getAllListItems = function(project, listId) {
  var db = selectProjectDB(project.dbname);
  return getAllObjects(db, DbTypes.TYPE_LIST_ITEM)
    .then(results => {
      var items = [];
      results.forEach(i => {
        if (i.listId === listId) {
          items.push(i);
        }
      });

      return items;
    });
};

var updateListItem = function(project, obj) {
  var db = selectProjectDB(project.dbname);
  return updateObject(db, DbTypes.TYPE_LIST_ITEM, obj)
    .then((res) => {
      if (project.room) {
        Replicator.updateForProject(project, 1);
      }
      return res;
    });
};

var removeListItem = function(project, id, options) {
  var db = selectProjectDB(project.dbname);
  return removeObject(db, DbTypes.TYPE_LIST_ITEM, id, options)
    .then((res) => {
      if (project.room) {
        Replicator.updateForProject(project, 1);
      }
      return res;
    });
};

// Component API
var getComponents = function(project) {
  let components = [];

  let promise = new Promise(function(resolve, reject) {
    getAllLists(project)
      .then(function(items) {
        items.forEach(function(item) {
          components.push(item);
        });
      })
      .then(function() {
        return getAllNotes(project);
      })
      .then(function(items) {
        items.forEach(function(item) {
          components.push(item);
        });
        resolve(components.sort(componentSort));
      });
  });

  return promise;
};

var compactAll = function() {
  debug('running database compaction...');

  var db = selectGlobalDB();
  db.compact();

  getAllGroups()
    .then((groups) => {
      groups.forEach((group) => {
        var groupDb = selectProjectDB(group.dbname);
        groupDb.compact();
      });
    });
};

export default {
  destroyDb: destroyDb,
  compactAll: compactAll,
  getGroup: getGroup,
  getAllGroups: getAllGroups,
  updateGroup: updateGroup,
  removeGroup: removeGroup,
  getPreference: getPreference,
  getAllPreferences: getAllPreferences,
  updatePreference: updatePreference,
  removePreference: removePreference,
  getSetting: getSetting,
  getAllSettings: getAllSettings,
  updateSetting: updateSetting,
  removeSetting: removeSetting,
  getNote: getNote,
  getAllNotes: getAllNotes,
  updateNote: updateNote,
  removeNote: removeNote,
  getList: getList,
  getAllLists: getAllLists,
  updateList: updateList,
  removeList: removeList,
  getListItem: getListItem,
  getAllListItems: getAllListItems,
  updateListItem: updateListItem,
  removeListItem: removeListItem,
  getComponents: getComponents
};
