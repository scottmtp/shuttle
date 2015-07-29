import AppDispatcher from '../AppDispatcher';

import ListAPI from './ListAPI';
import ListConstants from './ListConstants';

export default {
  getListItems: function(groupId, listId) {
    ListAPI.getListItems(groupId, listId);
  },
  
  addListItem: function(groupId, listId, text, status) {
    ListAPI.addListItem(groupId, listId, text, status);
  }
};
