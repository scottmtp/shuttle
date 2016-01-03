import AppDispatcher from '../AppDispatcher';
import NoteAPI from './NoteAPI';
import NoteConstants from './NoteConstants';

export default {
  getNote: function(groupId, noteId) {
    NoteAPI.getNote(groupId, noteId);
  },

  localUpdateNote: function(title, markup) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.LOCAL_UPDATE_NOTE_COMPLETED,
      title: title,
      html: markup
    });
  },

  updateNote: function(groupId, noteId, title, markup) {
    NoteAPI.updateNote(groupId, noteId, title, markup);
  }
};
