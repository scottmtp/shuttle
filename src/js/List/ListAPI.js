import uuid from 'uuid';

import AppDispatcher from '../AppDispatcher';
import ListConstants from './ListConstants';

import ListActions from './ListActions';
import dbApi from '../DbAPI';

let createItem = function(listId, text, status) {
  return {
    _id: uuid.v4(),
    listId: listId,
    text: text,
    status: status
  };
};

let getListItems = function(projectId, listId) {
  let project;
  let currentList = {
    title: '',
    listItems: []
  };

  dbApi.getGroup(projectId)
    .then(prj => {
      project = prj;
      return dbApi.getAllListItems(project, listId);
    })
    .then(items => {
      if (items && items.length) {
        currentList.listItems = items;
      }
    })
    .then(() => {
      return dbApi.getList(project, listId);
    })
    .then(list => {
      currentList.title = list.title;
      ListActions.getListItemsCompleted(currentList);
    });
};

let addListItem = function(projectId, listId, text, status) {
  let item = createItem(listId, text, status);

  dbApi.getGroup(projectId)
    .then(project => {
      return dbApi.updateListItem(project, item);
    })
    .then(items => {
      ListActions.addItemCompleted(item);
    });
};

let setChecked = function(projectId, listItemId, checked) {
  let project;
  let listItem;
  let currentList = {
    title: '',
    listItems: []
  };

  dbApi.getGroup(projectId)
    .then(prj => {
      project = prj;
      return dbApi.getListItem(project, listItemId);
    })
    .then((item) => {
      listItem = item;
      listItem.status = checked ? ListConstants.STATUS_COMPLETED : ListConstants.STATUS_ACTIVE;
      return dbApi.updateListItem(project, listItem);
    })
    .then(() => {
      return dbApi.getAllListItems(project, listItem.listId);
    })
    .then(items => {
      if (items && items.length) {
        currentList.listItems = items;
      }
    })
    .then(() => {
      return dbApi.getList(project, listItem.listId);
    })
    .then(list => {
      currentList.title = list.title;
      ListActions.getListItemsCompleted(currentList);
    });

};

let updateItem = function() {

};

let clearList = function(groupId, listId) {
  let deletionPromises = [];
  let project;
  let currentList = {
    title: '',
    listItems: []
  };

  dbApi.getGroup(groupId)
    .then(prj => {
      project = prj;
    })
    .then(() => {
      return dbApi.getList(project, listId);
    })
    .then(list => {
      currentList.title = list.title;
    })
    .then(() => {
      return dbApi.getAllListItems(project, listId);
    })
    .then(items => {
      if (items && items.length) {
        currentList.listItems = items.filter(item => item.status !== ListConstants.STATUS_COMPLETED)
        items.filter(item => item.status === ListConstants.STATUS_COMPLETED)
          .forEach(item => {
            deletionPromises.push(dbApi.removeListItem(project, item._id));
          });
      }
    })
    .then(() => {
      Promise.all(deletionPromises)
        .then(function() {
          ListActions.clearListCompleted(currentList);
        });
    });
};

export default {
  getListItems: getListItems,
  addListItem: addListItem,
  setChecked: setChecked,
  updateItem: updateItem,
  clearList: clearList
};