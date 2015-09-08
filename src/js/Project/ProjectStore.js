import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import DbTypes from '../DbTypes';
import ProjectConstants from './ProjectConstants';

let projects = [];
let activeProject = {_id: '', name: '', url: '', room: ''};
let activeProjectParts = [];

let addPart = {title: '', type: DbTypes.TYPE_NOTE};
let renamePart = {_id: '', title: ''};
let deletePart = {_id: '', title: ''};

let deleteProject = {_id: '', name: ''};

let tokenRequestEmail = {email: ''};

let CHANGE_EVENT = 'change';

let ProjectStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getProjects: function() {
    return projects;
  },

  getActiveProject: function() {
    return activeProject;
  },

  getActiveProjectParts: function() {
    return activeProjectParts;
  },

  getAddPart: function() {
    return addPart;
  },

  getRenamePart: function() {
    return renamePart;
  },

  getDeletePart: function() {
    return deletePart;
  },

  getDeleteProject: function() {
    return deleteProject;
  },

  getTokenRequestEmail: function() {
    return tokenRequestEmail;
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ProjectConstants.GET_COMPLETED:
    case ProjectConstants.CREATE_COMPLETED:
    case ProjectConstants.UPDATE_COMPLETED:
    case ProjectConstants.DELETE_PROJECT_COMPLETED:
      projects = action.projects;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.GET_ACTIVE_PROJECT_PARTS_COMPLETED:
      activeProjectParts = action.components;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_ACTIVE_PROJECT_COMPLETED:
      activeProject = assign({}, action.activeProject);
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_ACTIVE_PROJECT_VALUES_COMPLETED:
      activeProject.name = action.values.name;
      activeProject.room = action.values.room;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_ADD_PART_VALUES_COMPLETED:
      addPart.title = action.values.title;
      addPart.type = action.values.type;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_RENAME_PART_COMPLETED:
      renamePart = assign({}, action.part);
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_DELETE_PART_COMPLETED:
      deletePart = assign({}, action.part);
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_RENAME_PART_VALUE_COMPLETED:
      renamePart.title = action.title;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.ADD_PART_COMPLETED:
    case ProjectConstants.RENAME_PART_COMPLETED:
    case ProjectConstants.DELETE_PART_COMPLETED:
      activeProjectParts = action.components;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_DELETE_PROJECT_COMPLETED:
      deleteProject = action.project;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.UPDATE_TOKEN_REQUEST_EMAIL_COMPLETED:
      tokenRequestEmail.email = action.email;
      ProjectStore.emitChange();
      break;

    default:
      // no op
  }
});


export default ProjectStore;
