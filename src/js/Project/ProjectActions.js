import AppDispatcher from '../AppDispatcher';
import ProjectConstants from './ProjectConstants';

export default {
  getCompleted: function(groups) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.GET_COMPLETED,
      projects: groups
    });
  },

  updateCompleted: function(groups) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.UPDATE_COMPLETED,
      projects: groups
    });
  },

  createCompleted: function(groups) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CREATE_COMPLETED,
      projects: groups
    });
  },

  getActiveProjectPartsCompleted: function(components) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.GET_ACTIVE_PROJECT_PARTS_COMPLETED,
      components: components
    });
  },

  addPartCompleted: function(components) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.ADD_PART_COMPLETED,
      components: components
    });
  },

  renamePartCompleted: function(components) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.RENAME_PART_COMPLETED,
      components: components
    });
  },

  deletePartCompleted: function(components) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.DELETE_PART_COMPLETED,
      components: components
    });
  }
};
