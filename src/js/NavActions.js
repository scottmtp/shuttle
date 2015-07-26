import AppDispatcher from './AppDispatcher';
import NavConstants from './NavConstants';

module.exports = {
  receiveUpdate: function(items) {
    AppDispatcher.dispatch({
      'actionType': NavConstants.RECEIVE_UPDATE,
      'menuItems': items
    });
  }
};
