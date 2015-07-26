import AppDispatcher from '../AppDispatcher';
import NoteConstants from './NoteConstants';

module.exports = {
  create: function(id) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.CREATE,
      id: id
    });
  },
  
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.DESTROY,
      id: id
    });
  },
  
  update: function(note) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.UPDATE,
      id: note._id
    });
  }
};
