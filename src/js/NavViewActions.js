import AppDispatcher from './AppDispatcher';
import NavAPI from './NavAPI';
import NavConstants from './NavConstants';

export default {
  update: function() {
    AppDispatcher.dispatch({
      'actionType': NavConstants.UPDATE
    });
    
    NavAPI.updateMenuItems();
  }
};
