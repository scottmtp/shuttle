import AppDispatcher from '../AppDispatcher';
import ListAPI from './ListAPI';
import ListConstants from './ListConstants';

export default {
  getListItems: function(groupId, listId) {
    ListAPI.getListItems(groupId, listId);
  },

  addListItem: function(groupId, listId, text, status, order) {
    ListAPI.addListItem(groupId, listId, text, status, order);
  },

  setChecked: function(groupId, listItem, checked) {
    ListAPI.setChecked(groupId, listItem, checked);
  },

  clearList: function(groupId, listId) {
    ListAPI.clearList(groupId, listId);
  },

  setEditItem: function(listItem) {
    AppDispatcher.dispatch({
      actionType: ListConstants.SET_EDIT_ITEM_COMPLETED,
      item: listItem
    });
  },

  changeEditItemValue: function(listItem) {
    AppDispatcher.dispatch({
      actionType: ListConstants.SET_EDIT_ITEM_COMPLETED,
      item: listItem
    });
  },

  updateEditItem: function(groupId, listItem) {
    ListAPI.updateListItem(groupId, listItem);
  }
};
