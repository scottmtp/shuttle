import pouchDB from 'pouchdb';
import nodeDebug from 'debug';
let debug = nodeDebug('dbapi');

import _ from 'lodash';
import DbTypes from './DbTypes';

import Replicator from './Replicator';

window.PouchDB = pouchDB;
let db;

// Use the global database
var selectGlobalDB = function() {
  debug('Switching to global database.');
  db = pouchDB(DbTypes.GLOBAL_DB);
};

// Use a project database
var selectProjectDB = function(dbName) {
  debug('selectProjectDB db: ' + dbName);
  db = pouchDB(dbName);
};

//
// Generic API
//

// Find one object
var getObject = function(collection, id) {
  debug('getObject: ' + collection + ', ' + id);
  return db.get(id)
    .catch(function(err) {
      if (err.status !== 404) {
        throw (err);
      }
    });
};

// Get all objects
var getAllObjects = function(collection) {
  debug('getAllObjects: ' + collection);

  return db.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    debug('getAllObjects results: ' + JSON.stringify(result));
    var docs = _.chain(result.rows)
      .pluck('doc')
      .filter(function(n) {
        return n.type === collection;
      })
      .value();

    debug('getAllObjects filtered: ' + JSON.stringify(docs));
    return docs;
  });
};

// Update or insert object
var updateObject = function(collection, obj) {
  debug('updateObject: ' + collection + ', ' + JSON.stringify(obj));
  obj.type = collection;
  return db.put(obj);
};

// Delete object
var removeObject = function(collection, id) {
  debug('removeObject: ' + collection + ', ' + id);
  return db.get(id).then(function(doc) {
    return db.remove(doc);
  });
};

//
// Group API
//
var getGroup = function(id) {
  selectGlobalDB();
  return getObject(DbTypes.TYPE_GROUP, id);
};

var getAllGroups = function() {
  selectGlobalDB();
  return getAllObjects(DbTypes.TYPE_GROUP);
};

var updateGroup = function(obj) {
  selectGlobalDB();
  return updateObject(DbTypes.TYPE_GROUP, obj);
};

var removeGroup = function(id) {
  selectGlobalDB();
  return removeObject(DbTypes.TYPE_GROUP, id);
};

//
// Preference API
//
var getPreference = function(id) {
  selectGlobalDB();
  return getObject(DbTypes.TYPE_PREFERENCE, id);
};

var getAllPreferences = function() {
  selectGlobalDB();
  return getAllObjects(DbTypes.TYPE_PREFERENCE);
};

var updatePreference = function(obj) {
  selectGlobalDB();
  return updateObject(DbTypes.TYPE_PREFERENCE, obj);
};

var removePreference = function(id) {
  selectGlobalDB();
  return removeObject(DbTypes.TYPE_PREFERENCE, id);
};

//
// Settings API
//
var getSetting = function(project, id) {
  selectProjectDB(project.dbname);
  return getObject(DbTypes.TYPE_SETTING, id);
};

var getAllSettings = function(project) {
  selectProjectDB(project.dbname);
  return getAllObjects(DbTypes.TYPE_SETTING);
};

var updateSetting = function(project, obj) {
  selectProjectDB(project.dbname);
  return updateObject(DbTypes.TYPE_SETTING, obj);
};

var removeSetting = function(project, id) {
  selectProjectDB(project.dbname);
  return removeObject(DbTypes.TYPE_SETTING, id);
};

//
// Note API
//
var getNote = function(project, id) {
  selectProjectDB(project.dbname);
  return getObject(DbTypes.TYPE_NOTE, id);
};

var getAllNotes = function(project) {
  selectProjectDB(project.dbname);
  return getAllObjects(DbTypes.TYPE_NOTE);
};

var updateNote = function(project, obj) {
  selectProjectDB(project.dbname);
  return updateObject(DbTypes.TYPE_NOTE, obj)
    .then((res) => {
      Replicator.updateForProject(project);
      return res;
    });
};

var removeNote = function(project, id) {
  selectProjectDB(project.dbname);
  return removeObject(DbTypes.TYPE_NOTE, id)
    .then((res) => {
      Replicator.updateForProject(project);
      return res;
    });
};

//
// List API
//
var getList = function(project, id) {
  selectProjectDB(project.dbname);
  return getObject(DbTypes.TYPE_LIST, id);
};

var getAllLists = function(project) {
  selectProjectDB(project.dbname);
  return getAllObjects(DbTypes.TYPE_LIST);
};

var updateList = function(project, obj) {
  selectProjectDB(project.dbname);
  return updateObject(DbTypes.TYPE_LIST, obj)
    .then((res) => {
      Replicator.updateForProject(project);
      return res;
    });
};

var removeList = function(project, id) {
  selectProjectDB(project.dbname);
  return removeObject(DbTypes.TYPE_LIST, id)
    .then((res) => {
      Replicator.updateForProject(project);
      return res;
    });
};

//
// List Item API
//
var getListItem = function(project, id) {
  selectProjectDB(project.dbname);
  return getObject(DbTypes.TYPE_LIST_ITEM, id);
};

var getAllListItems = function(project, listId) {
  selectProjectDB(project.dbname);
  return getAllObjects(DbTypes.TYPE_LIST_ITEM)
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
  selectProjectDB(project.dbname);
  return updateObject(DbTypes.TYPE_LIST_ITEM, obj)
    .then((res) => {
      Replicator.updateForProject(project);
      return res;
    });
};

var removeListItem = function(project, id) {
  selectProjectDB(project.dbname);
  return removeObject(DbTypes.TYPE_LIST_ITEM, id)
    .then((res) => {
      Replicator.updateForProject(project);
      return res;
    });
};

// Component API
var getComponents = function(project) {
  let components = [];

  let promise = new Promise(function(resolve, reject) {
    getAllNotes(project)
      .then(function(items) {
        items = _.sortBy(items, 'title');
        items.forEach(function(item) {
          components.push(item);
        });
      })
      .then(function() {
        return getAllLists(project);
      })
      .then(function(items) {
        items = _.sortBy(items, 'title');
        items.forEach(function(item) {
          components.push(item);
        });
        resolve(components);
      });
  });

  return promise;
};

export default {
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
