import AppDispatcher from '../AppDispatcher';
import NoteConstants from './NoteConstants';
import NoteAPI from './NoteAPI';

export default {
  getNote: function(groupId, noteId) {
    AppDispatcher.dispatch({
      actionType: NoteConstants.GET,
      groupId: groupId,
      noteId: noteId
    });
    
    NoteAPI.getNote(groupId, noteId);
  }
};
