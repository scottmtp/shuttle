import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import ProjectConstants from './ProjectConstants';

let projects = [];
let activeProject = {_id: '', name: '', url: '', room: ''}
let components = [];
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

  getComponents: function() {
    return components;
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ProjectConstants.GET_COMPLETED:
    case ProjectConstants.CREATE_COMPLETED:
    case ProjectConstants.UPDATE_COMPLETED:
      projects = action.projects;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.GET_COMPONENTS_COMPLETED:
      components = action.components;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_ACTIVE_PROJECT_COMPLETED:
      activeProject = assign({}, action.activeProject);
      ProjectStore.emitChange();
      break;

    case ProjectConstants.SET_ACTIVE_PROJECT_VALUES_COMPLETED:
      activeProject.name = action.values.name;
      activeProject.signaller = action.values.signaller;
      activeProject.room = action.values.room;
      ProjectStore.emitChange();
      break;

    default:
      // no op
  }
});


export default ProjectStore;
