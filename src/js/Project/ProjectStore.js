import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import DbTypes from '../DbTypes';
import ProjectConstants from './ProjectConstants';

let state = {
  projects: [],
  activeProject: {_id: '', name: '', url: '', room: ''},
  activeProjectParts: [],
  addPart: {title: '', type: DbTypes.TYPE_LIST},
  renamePart: {_id: '', title: ''},
  deletePart: {_id: '', title: ''},
  deleteProject: {_id: '', name: ''},
  tokenRequestEmail: {email: ''},
  deleteProjectDialogOpen: false,
  tokenRequestIndicatorOpen: false,
  requestTokenDialogOpen: false,
  deletePartDialogOpen: false,
  renamePartDialogOpen: false,
  addPartDialogOpen: false,
  projectDialogOpen: false
};

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

  getState() {
    return state;
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ProjectConstants.GET_PROJECT_COMPLETED:
    case ProjectConstants.CREATE_PROJECT_COMPLETED:
    case ProjectConstants.UPDATE_PROJECT_COMPLETED:
    case ProjectConstants.DELETE_PROJECT_COMPLETED:
      state.projects = action.projects;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.GET_ACTIVE_PROJECT_PARTS_COMPLETED:
      state.activeProjectParts = action.components;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.SET_ACTIVE_PROJECT_COMPLETED:
      state.activeProject = assign({}, action.activeProject);
      ProjectStore.emitChange();
    break;

    case ProjectConstants.SET_ACTIVE_PROJECT_VALUES_COMPLETED:
      state.activeProject.name = action.values.name;
      state.activeProject.room = action.values.room;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.SET_ADD_PART_VALUES_COMPLETED:
      state.addPart.title = action.values.title;
      state.addPart.type = action.values.type;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.SET_RENAME_PART_COMPLETED:
      state.renamePart = assign({}, action.part);
      ProjectStore.emitChange();
    break;

    case ProjectConstants.SET_DELETE_PART_COMPLETED:
      state.deletePart = assign({}, action.part);
      ProjectStore.emitChange();
    break;

    case ProjectConstants.SET_RENAME_PART_VALUE_COMPLETED:
      state.renamePart.title = action.title;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.ADD_PART_COMPLETED:
    case ProjectConstants.RENAME_PART_COMPLETED:
    case ProjectConstants.DELETE_PART_COMPLETED:
      state.activeProjectParts = action.components;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.SET_DELETE_PROJECT_COMPLETED:
      state.deleteProject = action.project;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.UPDATE_TOKEN_REQUEST_EMAIL_COMPLETED:
      state.tokenRequestEmail.email = action.email;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.OPEN_DELETE_PROJECT_DIALOG:
      state.deleteProjectDialogOpen = true;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.CLOSE_DELETE_PROJECT_DIALOG:
      state.deleteProjectDialogOpen = false;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.OPEN_REQUEST_TOKEN_INDICATOR:
      state.tokenRequestIndicatorOpen = true;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.CLOSE_REQUEST_TOKEN_INDICATOR:
      state.tokenRequestIndicatorOpen = false;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.OPEN_REQUEST_TOKEN_DIALOG:
      state.requestTokenDialogOpen = true;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.CLOSE_REQUEST_TOKEN_DIALOG:
      state.requestTokenDialogOpen = false;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.OPEN_DELETE_PART_DIALOG:
      state.deletePartDialogOpen = true;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.CLOSE_DELETE_PART_DIALOG:
      state.deletePartDialogOpen = false;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.OPEN_RENAME_PART_DIALOG:
      state.renamePartDialogOpen = true;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.CLOSE_RENAME_PART_DIALOG:
      state.renamePartDialogOpen = false;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.OPEN_ADD_PART_DIALOG:
      state.addPartDialogOpen = true;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.CLOSE_ADD_PART_DIALOG:
      state.addPartDialogOpen = false;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.OPEN_PROJECT_DIALOG:
      state.projectDialogOpen = true;
      ProjectStore.emitChange();
    break;

    case ProjectConstants.CLOSE_PROJECT_DIALOG:
      state.projectDialogOpen = false;
      ProjectStore.emitChange();
    break;

    default:
      // no op
  }
});


export default ProjectStore;
