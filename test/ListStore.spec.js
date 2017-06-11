'use strict';
import ListViewActions from '../src/js/List/ListViewActions';
import ListActions from '../src/js/List/ListActions';
import ListStore from '../src/js/List/ListStore';

PouchDB.plugin(require('pouchdb-adapter-memory'));
global.pouch_adapter = 'memory';

describe('list store events', function() {

  afterEach(function() {
    ListStore.removeAllListeners('change');
  });

  it('should emit on get items completed', () => {
    var list = {title: 'items', listItems: ['a', 'b', 'c'], editItem: {}};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      expect(state.list).toBe(list);
    });

    ListActions.getListItemsCompleted(list);
  });

  it('should emit on set edit item', () => {
    var item = {_id: 1234};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      expect(state.editItem).toBe(item);
    });

    ListViewActions.setEditItem(item);
  });

  it('should emit on change edit item', () => {
    var item = {_id: 2345};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      expect(state.editItem).toBe(item);
    });

    ListViewActions.changeEditItemValue(item);
  });

  it('should emit on add list item', () => {
    var item = {_id: 3456};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      expect(state.list.listItems.indexOf(item)).toBeGreaterThan(0);
    });

    ListActions.addItemCompleted(item);
  });

  it('should emit on clear list', () => {
    var list = {title: 'list', listItems: ['d', 'e', 'f'], editItem: {}};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      expect(state.list).toBe(list);
    });

    ListActions.clearListCompleted(list);
  });
});

