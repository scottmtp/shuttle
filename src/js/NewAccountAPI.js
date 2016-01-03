import uuid from 'uuid';
import dbApi from './DbAPI';
import DbTypes from './DbTypes';

import ProjectViewActions from './Project/ProjectViewActions';

export default {

  initializeNewAccount: function($localStorage) {
    $localStorage.initialized = 1;
    let project = {
      _id: uuid.v4(),
      name: 'My Project',
      dbname: 's_' + uuid.v4()
    };

    let note1 = {
      _id: uuid.v4(),
      title: 'Getting Started',
      html: ''
    };

    let list1 = {
      _id: uuid.v4(),
      title: 'Shopping'
    };

    let list2 = {
      _id: uuid.v4(),
      title: 'Todo'
    };

    return dbApi.updateGroup(project)
      .then(function() {
        return dbApi.updateNote(project, note1);
      })
      .then(function() {
        return dbApi.updateList(project, list1);
      })
      .then(function() {
        return dbApi.updateList(project, list2);
      })
      .then(function() {
        ProjectViewActions.getProjects();
      });
  }
};
