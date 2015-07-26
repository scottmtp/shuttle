import AppDispatcher from './AppDispatcher';
import NavConstants from './NavConstants';

export default {
  receiveUpdate: function(items) {
    AppDispatcher.dispatch({
      'actionType': NavConstants.RECEIVE_UPDATE,
      'menuItems': items
    });
  }
};
