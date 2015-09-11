import AppDispatcher from './AppDispatcher';
import NavConstants from './NavConstants';

export default {
  receiveUpdate: function(items) {
    AppDispatcher.dispatch({
      'actionType': NavConstants.NAV_RECEIVE_UPDATE,
      'menuItems': items
    });
  }
};
