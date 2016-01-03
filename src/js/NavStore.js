import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from './AppDispatcher';
import NavConstants from './NavConstants';

let CHANGE_EVENT = 'change';
let REPLICATION_EVENT = 'replication';

let state = {
  menuItems: [],
  helpDialogOpen: false,
  leftNavOpen: false,
  replIndicatorOpen: false,
  appRefreshIndicatorOpen: false
};

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

  getState: function() {
    return state;
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case NavConstants.NAV_RECEIVE_UPDATE:
      state.menuItems = action.menuItems;
      NavStore.emitChange();
      break;

    case NavConstants.REPLICATION_UPDATE:
      NavStore.emitReplicationChange();
      break;

    case NavConstants.HELP_OPEN:
      state.helpDialogOpen = true;
      NavStore.emitChange();
      break;

    case NavConstants.HELP_CLOSE:
      state.helpDialogOpen = false;
      NavStore.emitChange();
      break;

    case NavConstants.NAV_OPEN:
      state.leftNavOpen = true;
      NavStore.emitChange();
      break;

    case NavConstants.NAV_CLOSE:
      state.leftNavOpen = false;
      NavStore.emitChange();
      break;

    case NavConstants.REPL_INDICATOR_OPEN:
      state.replIndicatorOpen = true;
      NavStore.emitChange();
      break;

    case NavConstants.REPL_INDICATOR_CLOSE:
      state.replIndicatorOpen = false;
      NavStore.emitChange();
      break;

    case NavConstants.APP_REFRESH_INDICATOR_OPEN:
      state.appRefreshIndicatorOpen = true;
      NavStore.emitChange();
      break;

    case NavConstants.APP_REFRESH_INDICATOR_CLOSE:
      state.appRefreshIndicatorOpen = false;
      NavStore.emitChange();
      break;

    default:
      // no op
  }
});


export default NavStore;
