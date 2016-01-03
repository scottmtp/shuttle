'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

var ListViewActions = require('../src/js/List/ListViewActions');
var ListActions = require('../src/js/List/ListActions');
var ListStore = require('../src/js/List/ListStore');

describe('list store events', function() {

  afterEach(function() {
    ListStore.removeAllListeners('change');
  });

  it('should emit on get items completed', function(done) {
    var list = {title: 'items', listItems: ['a', 'b', 'c'], editItem: {}};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      assert.equal(list, state.list);
      done();
    });

    ListActions.getListItemsCompleted(list);
  });

  it('should emit on set edit item', function(done) {
    var item = {_id: 1234};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      assert.equal(item, state.editItem);
      done();
    });

    ListViewActions.setEditItem(item);
  });

  it('should emit on change edit item', function(done) {
    var item = {_id: 2345};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      assert.equal(item, state.editItem);
      done();
    });

    ListViewActions.changeEditItemValue(item);
  });

  it('should emit on add list item', function(done) {
    var item = {_id: 3456};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      assert.isTrue(state.list.listItems.indexOf(item) >= 0);
      done();
    });

    ListActions.addItemCompleted(item);
  });

  it('should emit on clear list', function(done) {
    var list = {title: 'list', listItems: ['d', 'e', 'f'], editItem: {}};

    ListStore.addChangeListener(function() {
      var state =  ListStore.getState();
      assert.equal(list, state.list);
      done();
    });

    ListActions.clearListCompleted(list);
  });
});
