import dbApi from '../DbAPI';
import NoteActions from './NoteActions';

let getNote = function(groupId, noteId) {
  dbApi.getGroup(groupId)
    .then(group => {
      return dbApi.getNote(group, noteId);
    })
    .then(function(note) {
      NoteActions.getCompleted(note);
    });
};

let updateNote = function(groupId, noteId, title, markup) {
  let theGroup;
  let theNote;

  dbApi.getGroup(groupId)
    .then(group => {
      theGroup = group;
      return dbApi.getNote(group, noteId);
    })
    .then(note => {
      theNote = note;
      note.title = title;
      note.html = markup;
      return dbApi.updateNote(theGroup, theNote);
    })
    .then(res => {
      theNote._rev = res._rev;
      NoteActions.updateCompleted(theNote);
    });
};

export default {
  getNote: getNote,
  updateNote: updateNote
};
