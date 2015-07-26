import pouchDB from 'pouchdb';
import nodeDebug from 'debug';
let debug = nodeDebug('dbapi');

import _ from 'lodash';

window.PouchDB = pouchDB;
let db;

// Use the global database
var selectGlobalDB = function() {
  debug('Switching to global database.');
  db = pouchDB('shuttle_global');
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
  return getObject('group', id);
};

var getAllGroups = function() {
  selectGlobalDB();
  return getAllObjects('group');
};

var updateGroup = function(obj) {
  selectGlobalDB();
  return updateObject('group', obj);
};

var removeGroup = function(id) {
  selectGlobalDB();
  return removeObject('group', id);
};

//
// Preference API
//
var getPreference = function(id) {
  selectGlobalDB();
  return getObject('preference', id);
};

var getAllPreferences = function() {
  selectGlobalDB();
  return getAllObjects('preference');
};

var updatePreference = function(obj) {
  selectGlobalDB();
  return updateObject('preference', obj);
};

var removePreference = function(id) {
  selectGlobalDB();
  return removeObject('preference', id);
};

//
// Settings API
//
var getSetting = function(project, id) {
  selectProjectDB(project.dbname);
  return getObject('setting', id);
};

var getAllSettings = function(project) {
  selectProjectDB(project.dbname);
  return getAllObjects('setting');
};

var updateSetting = function(project, obj) {
  selectProjectDB(project.dbname);
  return updateObject('setting', obj);
};

var removeSetting = function(project, id) {
  selectProjectDB(project.dbname);
  return removeObject('setting', id);
};

//
// Note API
//
var getNote = function(project, id) {
  selectProjectDB(project.dbname);
  return getObject('note', id);
};

var getAllNotes = function(project) {
  selectProjectDB(project.dbname);
  return getAllObjects('note');
};

var updateNote = function(project, obj) {
  selectProjectDB(project.dbname);
  return updateObject('note', obj);
};

var removeNote = function(project, id) {
  selectProjectDB(project.dbname);
  return removeObject('note', id);
};

module.exports = {
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
  removeNote: removeNote
};
