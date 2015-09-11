import { MenuItem } from 'material-ui';
import NavActions from './NavActions';

import dbApi from './DbAPI';
import newAccountApi from './NewAccountAPI';

let projectSort = (a, b) => a.name > b.name ? 1 : -1;

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
    let projectMap = [];

    // function to create menu after project outline is retrieved below
    let constructMenu = function() {
      projects.sort(projectSort).forEach(function(p) {
        let items = projectMap[p._id];
        menuItems = menuItems.concat(buildProjectMenuItem(p));
        if (items.length) {
          menuItems = menuItems.concat(buildComponentsMenu(p, items));
        }
      });

      resolve(menuItems);
    };

    // get project outline from pouchdb
    let done = 0;
    projects.forEach(function(p) {
      dbApi.getComponents(p)
      .then(function(items) {
        projectMap[p._id] = items;

        done++;
        if (done === projects.length) {
          constructMenu();
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
