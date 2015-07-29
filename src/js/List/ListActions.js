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
    actionType: ListConstants.UPDATE_LIST_ITEM_COMPLETED,
    item: item
  });
};

export default {
  getListItemsCompleted: getListItemsCompleted,
  addItemCompleted: addItemCompleted
};
