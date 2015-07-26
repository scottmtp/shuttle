import dbApi from '../DbAPI';
import NoteActions from './NoteActions';

let getNote = function(groupId, noteId) {
  dbApi.getGroup(groupId)
    .then(function(group) {
      return dbApi.getNote(group, noteId);
    })
    .then(function(note) {
      NoteActions.getCompleted(note);
    });
};

let updateNote = function(groupId, note) {
  
};

module.exports = {
  getNote: getNote,
  updateNote: updateNote
};
