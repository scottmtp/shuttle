import AppDispatcher from '../AppDispatcher';
import NoteConstants from './NoteConstants';

export default {
  getCompleted: function(note) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.GET_NOTE_COMPLETED,
      note: note
    });
  },

  updateCompleted: function(note) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.UPDATE_NOTE_COMPLETED,
      note: note
    });
  }
};
