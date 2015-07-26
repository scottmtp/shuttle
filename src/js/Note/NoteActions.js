import AppDispatcher from '../AppDispatcher';
import NoteConstants from './NoteConstants';

export default {
  getCompleted: function(note) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.GET_COMPLETED,
      note: note
    });
  }
};
