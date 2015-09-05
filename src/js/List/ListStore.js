import { EventEmitter } from 'events';
import assign from 'object-assign';

import ListConstants from './ListConstants';
import AppDispatcher from '../AppDispatcher';
let CHANGE_EVENT = 'change';

let currentList = {
  title: '',
  listItems: [],
  editItem: {}
};

let ListStore = assign({}, EventEmitter.prototype, {
  getCurrentList: function() {
    return currentList;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ListConstants.CLEAR_LIST_COMPLETED:
    case ListConstants.GET_LIST_ITEMS_COMPLETED:
      currentList = action.currentList;
      ListStore.emitChange();
      break;

    case ListConstants.ADD_LIST_ITEM_COMPLETED:
      currentList.listItems = currentList.listItems.concat(action.item);
      ListStore.emitChange();
      break;

    case ListConstants.SET_EDIT_ITEM_COMPLETED:
      currentList.editItem = action.item;
      ListStore.emitChange();
      break;

    default:
      // no op
  }
});


export default ListStore;
