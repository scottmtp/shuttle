import { EventEmitter } from 'events';
import assign from 'object-assign';

import ListConstants from './ListConstants';
import AppDispatcher from '../AppDispatcher';
let CHANGE_EVENT = 'change';

let state = {
  list: {
    title: '',
    listItems: [],
  },
  editItem: {},
  listItemUpdatedIndicatorOpen: false
};

let ListStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getState: function() {
    return state;
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ListConstants.CLEAR_LIST_COMPLETED:
    case ListConstants.GET_LIST_ITEMS_COMPLETED:
      state.list = action.currentList;
      ListStore.emitChange();
      break;

    case ListConstants.ADD_LIST_ITEM_COMPLETED:
      state.list.listItems = state.list.listItems.concat(action.item);
      ListStore.emitChange();
      break;

    case ListConstants.SET_EDIT_ITEM_COMPLETED:
      state.editItem = action.item;
      ListStore.emitChange();
      break;

    case ListConstants.LIST_ITEM_UPDATED_INDICATOR_OPEN:
      state.listItemUpdatedIndicatorOpen = true;
      ListStore.emitChange();
      break;

    case ListConstants.LIST_ITEM_UPDATED_INDICATOR_CLOSE:
      state.listItemUpdatedIndicatorOpen = false;
      ListStore.emitChange();
      break;
    default:
      // no op
  }
});


export default ListStore;
