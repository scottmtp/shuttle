import AppDispatcher from '../AppDispatcher';
import ListConstants from './ListConstants';

let getListItemsCompleted = function(currentList) {
  AppDispatcher.dispatch({
    actionType: ListConstants.GET_LIST_ITEMS_COMPLETED,
    currentList: currentList
  });
};

let addItemCompleted = function(item) {
  AppDispatcher.dispatch({
    actionType: ListConstants.ADD_LIST_ITEM_COMPLETED,
    item: item
  });
};

let clearListCompleted = function(currentList) {
  AppDispatcher.dispatch({
    actionType: ListConstants.CLEAR_LIST_COMPLETED,
    currentList: currentList
  });
};

export default {
  getListItemsCompleted: getListItemsCompleted,
  addItemCompleted: addItemCompleted,
  clearListCompleted: clearListCompleted
};
