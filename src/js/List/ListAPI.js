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

let getEmptyList = function() {
  return {
    title: '',
    listItems: [],
    editItem: {}
  };
};

let getListItems = function(projectId, listId) {
  let project;
  let currentList = getEmptyList();

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
    .then(() => {
      ListActions.addItemCompleted(item);
    });
};

let setChecked = function(projectId, editItem, checked) {
  editItem.status = checked ? ListConstants.STATUS_COMPLETED : ListConstants.STATUS_ACTIVE;
  updateListItem(projectId, editItem);
};

let updateListItem = function(projectId, editItem) {
  let project;
  let listItem;
  let currentList = getEmptyList();

  dbApi.getGroup(projectId)
    .then(prj => {
      project = prj;
      return dbApi.getListItem(project, editItem._id);
    })
    .then((item) => {
      listItem = item;
      listItem.text = editItem.text;
      listItem.status = editItem.status;
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
      currentList.editItem = {};
      ListActions.getListItemsCompleted(currentList);
    });
};

let clearList = function(groupId, listId) {
  let deletionPromises = [];
  let project;
  let currentList = getEmptyList();

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
        currentList.listItems = items.filter(item => item.status !== ListConstants.STATUS_COMPLETED);
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
  updateListItem: updateListItem,
  clearList: clearList
};
