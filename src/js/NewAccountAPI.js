import uuid from 'uuid';
import dbApi from './DbAPI';

import ProjectViewActions from './Project/ProjectViewActions';

export default {

  initializeNewAccount: function($localStorage) {
    console.log('initializeNewAccount');
    $localStorage.initialized = 1;
    let project = {
      _id: uuid.v4(),
      name: 'My Project',
      dbname: 's_' + uuid.v4()
    };

    let note1 = {
      _id: uuid.v4(),
      title: 'Notes',
      html: '<div>Welcome to Notes! You can edit this text by clicking on the Edit tab.</div>'
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
        // TODO: revisit how new accounts are initialized
        ProjectViewActions.getProjects();
      });
  }
};
