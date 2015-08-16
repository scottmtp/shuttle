import ProjectAPI from './ProjectAPI';

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
  }
};
