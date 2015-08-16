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
  }
};
