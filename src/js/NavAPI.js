import { MenuItem } from 'material-ui';
import NavActions from './NavActions';

import dbApi from './DbAPI';
import newAccountApi from './NewAccountAPI';

let buildProjectMenuItem = function(project) {
  return { type: MenuItem.Types.SUBHEADER, text: project.name };
};

let buildNoteMenuItem = function(project, note) {
  return { route: '/group/' + project._id + '/note/' + note._id, text: note.title };
};

let buildSettingsMenuItem = function(project) {
  return { route: '/group/' + project._id + '/settings', text: 'Settings' };
};

let buildMenu = function(projects) {
  var promise = new Promise(function(resolve, reject) {
    let itemPromises = [];
    projects.forEach(function(p) {
      itemPromises.push(dbApi.getAllNotes(p));
    });
  
    Promise.all(itemPromises)
    .then(values => {
      let menuItems = [];
      
      for (let i = 0; i < values.length; i++) {
        let project = projects[i];
        let notes = values[i];
        
        menuItems.push(buildProjectMenuItem(project));
        notes.forEach(function(note) {
          menuItems.push(buildNoteMenuItem(project, note));
        });
        
        menuItems.push(buildSettingsMenuItem(project));
      }
      
      resolve(menuItems);
    })
    .catch(function(e) {
      reject(e);
    });
    
  });
  
  return promise;
};

let getMenuItems = function() {
  var promise = dbApi.getAllGroups()
    .then(function(results) {
      if(results && results.length) {
        return buildMenu(results);
      } else {
        // initialize template project
        return newAccountApi.initializeNewAccount()
          .then(getMenuItems);
      }
    });
  
  return promise;
};

let updateMenuItems = function() {
  getMenuItems().then(function(results) {
    NavActions.receiveUpdate(results);
  });
};

export default {
  updateMenuItems: updateMenuItems
};
