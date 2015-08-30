import { MenuItem } from 'material-ui';
import NavActions from './NavActions';

import dbApi from './DbAPI';
import newAccountApi from './NewAccountAPI';

let buildProjectsMenuItem = function() {
  return { route: '/projects', text: 'Projects' };
};

let buildProjectMenuItem = function(project) {
  return { type: MenuItem.Types.SUBHEADER, text: project.name };
};

let buildComponentMenuItem = function(project, item) {
  return { route: '/group/' + project._id + '/' + item.type + '/' + item._id, text: item.title };
};

let buildComponentsMenu = function(project, items) {
  let menuItems = [];
  items.forEach(function(item) {
    menuItems.push(buildComponentMenuItem(project, item));
  });

  return menuItems;
};

let buildMenu = function(projects) {
  let promise = new Promise(function(resolve, reject) {
    let menuItems = [buildProjectsMenuItem()];
    let idx = 0;

    projects.forEach(function(p) {
      dbApi.getComponents(p)
      .then(function(items) {
        menuItems = menuItems.concat(buildProjectMenuItem(p));
        menuItems = menuItems.concat(buildComponentsMenu(p, items));

        idx++;
        if (idx === projects.length) {
          resolve(menuItems);
        }
      });
    });

  });

  return promise;
};

let getMenuItems = function() {
  var promise = dbApi.getAllGroups()
    .then(function(results) {
      if (results && results.length) {
        return buildMenu(results);
      } else {
        if (global.localStorage.initialized) {
          return [buildProjectsMenuItem()];
        }

        // initialize template project
        return newAccountApi.initializeNewAccount(global.localStorage)
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
