import AppDispatcher from './AppDispatcher';
import NavAPI from './NavAPI';
import NavConstants from './NavConstants';

module.exports = {
  update: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.UPDATE
    });
    
    NavAPI.updateMenuItems();
  }
};
