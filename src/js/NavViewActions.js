import AppDispatcher from './AppDispatcher';
import NavAPI from './NavAPI';
import NavConstants from './NavConstants';

export default {
  update: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.NAV_UPDATE
    });

    NavAPI.updateMenuItems();
  },

  replicationUpdate: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.REPLICATION_UPDATE
    });
  },

  navOpen: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.NAV_OPEN
    });
  },

  navClose: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.NAV_CLOSE
    });
  },

  helpOpen: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.HELP_OPEN
    });
  },

  helpClose: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.HELP_CLOSE
    });
  },

  replIndicatorOpen: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.REPL_INDICATOR_OPEN
    });
  },

  replIndicatorClose: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.REPL_INDICATOR_CLOSE
    });
  },

  appRefreshIndicatorOpen: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.APP_REFRESH_INDICATOR_OPEN
    });
  },

  appRefreshIndicatorClose: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.APP_REFRESH_INDICATOR_CLOSE
    });
  },
};
