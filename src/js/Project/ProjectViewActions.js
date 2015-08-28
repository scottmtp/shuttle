import AppDispatcher from '../AppDispatcher';
import ProjectAPI from './ProjectAPI';
import ProjectConstants from './ProjectConstants';

export default {
  getProjects: function() {
    ProjectAPI.getProjects();
  },

  updateProject: function(project) {
    if (project._id) {
      ProjectAPI.updateProject(project);
    } else {
      ProjectAPI.createProject(project.name, project.signaller, project.room);
    }
  },

  getActiveProjectParts: function(project) {
    ProjectAPI.getActiveProjectParts(project);
  },

  setActiveProject: function(project) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_ACTIVE_PROJECT_COMPLETED,
      activeProject: project
    });
  },

  setActiveProjectValues: function(name, room) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_ACTIVE_PROJECT_VALUES_COMPLETED,
      values: {name: name, room: room}
    });
  },

  setAddPartValues: function(title, type) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_ADD_PART_VALUES_COMPLETED,
      values: {title: title, type: type}
    });
  },

  addPart: function(project, part) {
    ProjectAPI.addPart(project, part);
  },

  setRenamePart: function(part) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_RENAME_PART_COMPLETED,
      part: part
    });
  },

  setRenamePartValue: function(title) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_RENAME_PART_VALUE_COMPLETED,
      title: title
    });
  },

  renamePart: function(project, part) {
    ProjectAPI.updatePart(project, part);
  },

  setDeletePart: function(part) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_DELETE_PART_COMPLETED,
      part: part
    });
  },

  deletePart: function(project, part) {
    ProjectAPI.deletePart(project, part);
  },

  updateReplicators() {
    ProjectAPI.updateReplicators();
  }
};
