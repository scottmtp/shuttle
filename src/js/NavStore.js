import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from './AppDispatcher';
import NavConstants from './NavConstants';

let menuItems = [];
let CHANGE_EVENT = 'change';

let NavStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  getMenuItems: function() {
    return menuItems;
  },

  receiveMenuItems: function(items) {
    menuItems = items;
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case NavConstants.RECEIVE_UPDATE:
      NavStore.receiveMenuItems(action.menuItems);
      NavStore.emitChange();
      break;

    default:
      // no op
  }
});


module.exports = NavStore;
