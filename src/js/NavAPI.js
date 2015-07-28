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

let buildListMenuItem = function(project, list) {
  return { route: '/group/' + project._id + '/list/' + list._id, text: list.title };
};

let buildSettingsMenuItem = function(project) {
  return { route: '/group/' + project._id + '/settings', text: 'Settings' };
};

let buildNotesMenu = function(project, notes) {
  let menuItems = [];
  notes = _.sortBy(notes, 'title');
  notes.forEach(function(note) {
    menuItems.push(buildNoteMenuItem(project, note));
  });
  
  return menuItems;
};

let buildListMenu = function(project, lists) {
  let menuItems = [];
  lists = _.sortBy(lists, 'title');
  lists.forEach(function(list) {
    menuItems.push(buildListMenuItem(project, list));
  });
  
  return menuItems;
};

let buildMenu = function(projects) {
  var promise = new Promise(function(resolve, reject) {
    let projectMap = _.indexBy(projects, 'dbname');
    
    let menuItems = [];
    projects.forEach(function(p) {
      menuItems = menuItems.concat(buildProjectMenuItem(p));
      
      dbApi.getAllNotes(p)
      .then(function(notes) {
        menuItems = menuItems.concat(buildNotesMenu(p, notes));
      })
      .then(function() {
        return dbApi.getAllLists(p)
      })
      .then(function(lists) {
        menuItems = menuItems.concat(buildListMenu(p, lists));
      })
      .then(function() {
        menuItems = menuItems.concat(buildSettingsMenuItem(p));
        resolve(menuItems);
      });
      
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
