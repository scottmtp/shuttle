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

  emitChange: function(updateEditor) {
    this.emit(CHANGE_EVENT, updateEditor);
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
      NoteStore.emitChange(true);
    break;

    // note update completed in pouchdb
    case NoteConstants.UPDATE_NOTE_COMPLETED:
      state.note = action.note;
      NoteStore.emitChange(false);
    break;

    default:
      // no op
  }
});

export default NoteStore;
