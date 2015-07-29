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
  
  return dbApi.getGroup(projectId)
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
  
  return dbApi.getGroup(projectId)
    .then(project => { return dbApi.updateListItem(project, item) })
    .then(items => { ListActions.addItemCompleted(item) });
};

let updateItem = function() {
  
};

export default {
  getListItems: getListItems,
  addListItem: addListItem,
  updateItem: updateItem
};
