import uuid from 'uuid';

import dbApi from '../DbAPI';
import dbTypes from '../DbTypes';
import ProjectActions from './ProjectActions';
import Replicator from '../Replicator';

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
    dbname: dbTypes.DB_PREFIX + uuid.v4(),
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
      ProjectActions.deleteProjectCompleted(groups);
    });
};

let getActiveProjectParts = function(project) {
  if (project._id) {
    dbApi.getComponents(project)
      .then(components => {
        ProjectActions.getActiveProjectPartsCompleted(components);
      });
  } else {
    ProjectActions.getActiveProjectPartsCompleted([]);
  }
};

let updateListPart = function(project, list) {
  dbApi.updateList(project, list)
    .then(() => {
      return dbApi.getComponents(project);
    })
    .then(components => {
      ProjectActions.addPartCompleted(components);
    });
};

let updateNotePart = function(project, note) {
  dbApi.updateNote(project, note)
    .then(() => {
      return dbApi.getComponents(project);
    })
    .then(components => {
      ProjectActions.addPartCompleted(components);
    });
};

let updatePart = function(project, part) {
  switch(part.type) {
    case dbTypes.TYPE_NOTE:
      updateNotePart(project, part);
      break;

    case dbTypes.TYPE_LIST:
      updateListPart(project, part);
      break;
  }
};

let addPart = function(project, part) {
  part._id = uuid.v4();
  updatePart(project, part);
};

let deleteListPart = function(project, list) {
  dbApi.getAllListItems(project, list._id)
    .then(items => {
      items.forEach(item => {
        dbApi.removeListItem(project, item._id);
      });
    })
    .then(() => {
      return dbApi.removeList(project, list._id);
    })
    .then(() => {
      return dbApi.getComponents(project);
    })
    .then(components => {
      ProjectActions.deletePartCompleted(components);
    });
};

let deleteNotePart = function(project, note) {
  Promise.resolve()
    .then(() => {
      return dbApi.removeNote(project, note._id);
    })
    .then(() => {
      return dbApi.getComponents(project);
    })
    .then(components => {
      ProjectActions.deletePartCompleted(components);
    });
};

let deletePart = function(project, part) {
  switch(part.type) {
    case dbTypes.TYPE_NOTE:
      deleteNotePart(project, part);
      break;

    case dbTypes.TYPE_LIST:
      deleteListPart(project, part);
      break;
  }
};

let updateReplicators = function() {
  dbApi.getAllGroups()
    .then(projects => {
      Replicator.update(projects);
    });
};

export default {
  getProjects: getProjects,
  createProject: createProject,
  updateProject: updateProject,
  deleteProject: deleteProject,
  getActiveProjectParts: getActiveProjectParts,
  addPart: addPart,
  updatePart: updatePart,
  deletePart: deletePart,
  updateReplicators: updateReplicators
};
