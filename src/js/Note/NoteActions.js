import AppDispatcher from '../AppDispatcher';
import NoteConstants from './NoteConstants';

module.exports = {
  getCompleted: function(note) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.GET_COMPLETED,
      note: note
    });
  }
};
