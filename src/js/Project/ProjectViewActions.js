import AppDispatcher from '../AppDispatcher';
import ProjectAPI from './ProjectAPI';
import ProjectConstants from './ProjectConstants';

export default {
  getProjects: function(groupId, noteId) {
    ProjectAPI.getProjects();
  },

  updateProject: function(project) {
    if (!!project._id) {
      ProjectAPI.updateProject(project);
    } else {
      ProjectAPI.createProject(project.name, project.signaller, project.room);
    }
  },

  getComponents: function(project) {
    ProjectAPI.getComponents(project);
  },

  setActiveProject: function(project) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_ACTIVE_PROJECT_COMPLETED,
      activeProject: project
    });
  },

  setActiveProjectValues: function(name, url, room) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_ACTIVE_PROJECT_VALUES_COMPLETED,
      values: {name: name, signaller: url, room: room}
    });
  }
};
