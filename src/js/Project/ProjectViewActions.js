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

  setDeleteProject: function(project) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.SET_DELETE_PROJECT_COMPLETED,
      project: project
    });
  },

  deleteProject: function(project) {
    ProjectAPI.deleteProject(project);
  },

  updateReplicators: function() {
    ProjectAPI.updateReplicators();
  },

  updateTokenRequestEmail: function(emailAddress) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.UPDATE_TOKEN_REQUEST_EMAIL_COMPLETED,
      email: emailAddress
    });
  },

  sendTokenRequest: function(email) {
    ProjectAPI.sendTokenRequest(email);
  },

  openDeleteProjectDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.OPEN_DELETE_PROJECT_DIALOG
    });
  },

  closeDeleteProjectDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CLOSE_DELETE_PROJECT_DIALOG
    });
  },

  openTokenRequestIndicator: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.OPEN_REQUEST_TOKEN_INDICATOR
    });
  },

  closeTokenRequestIndicator: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CLOSE_REQUEST_TOKEN_INDICATOR
    });
  },

  openRequestTokenDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.OPEN_REQUEST_TOKEN_DIALOG
    });
  },

  closeRequestTokenDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CLOSE_REQUEST_TOKEN_DIALOG
    });
  },

  openDeletePartDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.OPEN_DELETE_PART_DIALOG
    });
  },

  closeDeletePartDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CLOSE_DELETE_PART_DIALOG
    });
  },

  openRenamePartDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.OPEN_RENAME_PART_DIALOG
    });
  },

  closeRenamePartDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CLOSE_RENAME_PART_DIALOG
    });
  },

  openAddPartDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.OPEN_ADD_PART_DIALOG
    });
  },

  closeAddPartDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CLOSE_ADD_PART_DIALOG
    });
  },

  openProjectDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.OPEN_PROJECT_DIALOG
    });
  },

  closeProjectDialog: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.CLOSE_PROJECT_DIALOG
    });
  },
};
