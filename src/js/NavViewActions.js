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
  }
};
