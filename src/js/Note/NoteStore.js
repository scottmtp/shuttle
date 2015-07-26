import { EventEmitter } from 'events';
import assign from 'object-assign';

import NoteConstants from './NoteConstants';
import AppDispatcher from '../AppDispatcher';
let CHANGE_EVENT = 'change';

let NoteStore = assign({}, EventEmitter.prototype, {
  
  getNote: function(noteId) {
    return {
      title: 'My awesome note!',
      __html: '<h2>Note Store!</h2><div><p>hello world: ' + noteId + '</p></div><ul><li>one</li><li>two</li></ul>'
    };
  },
  
  saveNote: function(note) {
    
  },
  
  createNote: function() {
    
  },
  
  destroyNote: function() {
    
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
    case NoteConstants.CREATE:
      NoteStore.emitChange();
      break;

    case NoteConstants.DESTROY:
      NoteStore.emitChange();
      break;
      
    case NoteConstants.UPDATE:
      NoteStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = NoteStore;
