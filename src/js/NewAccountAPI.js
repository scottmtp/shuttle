import uuid from 'uuid';
import dbApi from './DbAPI';

export default {
  
  initializeNewAccount: function() {
    console.log('initializeNewAccount');
    let project = {
      _id: uuid.v4(),
      name: 'My Project',
      dbname: 's_' + uuid.v4()
    };

    let note1 = {
      _id: uuid.v4(),
      title: 'Getting Started',
      html: '<h1>Welcome to Getting Started!</h1>'
    };
  
    let note2 = {
      _id: uuid.v4(),
      title: 'Notes',
      html: '<h1>Welcome to Notes!</h1>'
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
        return dbApi.updateNote(project, note2);
      })
      .then(function() {
        return dbApi.updateList(project, list1);
      })
      .then(function() {
        return dbApi.updateList(project, list2);
      });
  }
};
