'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('nav event dispatch', function() {
 it('should emit store change on view update action', function(done) {
   var NavViewActions = require('../src/js/NavViewActions');
   var NavStore = require('../src/js/NavStore');
   NavStore.addChangeListener(function() {
     done();
   });

   NavViewActions.update();
 });

 it('should emit store change on view replication action', function(done) {
   var NavViewActions = require('../src/js/NavViewActions');
   var NavStore = require('../src/js/NavStore');
   NavStore.addReplicationChangeListener(function() {
     done();
   });

   NavViewActions.replicationUpdate();
 });

 it('should update menu items', function(done) {
   var menuItems = ['a', 'b', 'c'];
   var NavActions = require('../src/js/NavActions');
   var NavStore = require('../src/js/NavStore');
   NavStore.addChangeListener(function() {
     var state = NavStore.getState();
     assert.equal(menuItems, state.menuItems);
     done();
   });

   NavActions.receiveUpdate(menuItems);
 });

});
