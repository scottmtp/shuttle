import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from './AppDispatcher';
import NavConstants from './NavConstants';

let menuItems = [];
let CHANGE_EVENT = 'change';
let REPLICATION_EVENT = 'replication';

let NavStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitReplicationChange: function() {
    this.emit(REPLICATION_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addReplicationChangeListener: function(callback) {
    this.on(REPLICATION_EVENT, callback);
  },

  removeReplicationChangeListener: function(callback) {
    this.removeListener(REPLICATION_EVENT, callback);
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

    case NavConstants.REPLICATION_UPDATE:
      NavStore.emitReplicationChange();
      break;

    default:
      // no op
  }
});


export default NavStore;
