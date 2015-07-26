import { EventEmitter } from 'events';
import assign from 'object-assign';

import NoteConstants from './NoteConstants';
import AppDispatcher from '../AppDispatcher';
let CHANGE_EVENT = 'change';

let currentNote = {
  _id: '',
  title: '',
  html: '',
  __html: ''
};

let NoteStore = assign({}, EventEmitter.prototype, {
  getCurrentNote: function() {
    return currentNote;
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
    case NoteConstants.GET:
      NoteStore.emitChange();
      break;
      
    case NoteConstants.GET_COMPLETED:
      currentNote = action.note;
      NoteStore.emitChange();
      break;
    
    case NoteConstants.CREATE:
      NoteStore.emitChange();
      break;

    case NoteConstants.UPDATE:
      NoteStore.emitChange();
      break;

    default:
      // no op
  }
});

export default NoteStore;
