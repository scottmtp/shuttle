import uuid from 'uuid';

import dbApi from '../DbAPI';
import ProjectActions from './ProjectActions';

let getProjects = function() {
  dbApi.getAllGroups()
    .then(groups => {
      ProjectActions.getCompleted(groups);
    });
};

let createProject = function(name, signaller, room) {
  let project = {
    _id: uuid.v4(),
    name: name,
    dbname: 's_' + uuid.v4(),
    signaller: signaller,
    room: room
  };

  dbApi.updateGroup(project)
    .then(dbApi.getAllGroups)
    .then(groups => {
      ProjectActions.createCompleted(groups);
    });
};

let updateProject = function(project) {
  dbApi.updateGroup(project)
    .then(dbApi.getAllGroups)
    .then(groups => {
      ProjectActions.updateCompleted(groups);
    });
};

let deleteProject = function(project) {
  dbApi.removeGroup(project._id)
    .then(dbApi.getAllGroups)
    .then(groups => {
      ProjectActions.deleteCompleted(groups);
    });
};

export default {
  getProjects: getProjects,
  createProject: createProject,
  updateProject: updateProject,
  deleteProject: deleteProject
}
