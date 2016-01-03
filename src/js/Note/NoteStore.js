import { EventEmitter } from 'events';
import assign from 'object-assign';

import NoteConstants from './NoteConstants';
import AppDispatcher from '../AppDispatcher';
let CHANGE_EVENT = 'change';

let state = {
  note: {
    title: '',
    html: ''
  }
};

let NoteStore = assign({}, EventEmitter.prototype, {
  getState: function() {
    return state;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case NoteConstants.GET_NOTE_COMPLETED:
      state.note = action.note;
      NoteStore.emitChange();
      break;

    case NoteConstants.LOCAL_UPDATE_NOTE_COMPLETED:
      state.note.title = action.title;
      state.note.html = action.html;
      NoteStore.emitChange();
      break;

    // this indicates that the note has been updated on the backend
    case NoteConstants.UPDATE_NOTE_COMPLETED:
    default:
      // no op
  }
});

export default NoteStore;
