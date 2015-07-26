import NoteAPI from './NoteAPI';

export default {
  getNote: function(groupId, noteId) {
    NoteAPI.getNote(groupId, noteId);
  },
  
  updateNote: function(groupId, noteId, title, markup) {
    NoteAPI.updateNote(groupId, noteId, title, markup);
  }
};
