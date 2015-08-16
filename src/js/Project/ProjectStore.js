import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import ProjectConstants from './ProjectConstants';

let projects = [];
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
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ProjectConstants.GET_COMPLETED:
    case ProjectConstants.CREATE_COMPLETED:
    case ProjectConstants.UPDATE_COMPLETED:
      projects = action.projects;
      ProjectStore.emitChange();
      break;

    default:
      // no op
  }
});


export default ProjectStore;
