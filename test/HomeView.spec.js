'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('home view transition', function() {
 it('should redirect to projects page', function(done) {
   var HomeView = require('../src/js/HomeView');
   var transition = {};
   transition.redirect = function(loc) {
     assert.equal('projects', loc);
     done();
   };

   HomeView.willTransitionTo(transition, {}, {}, function() {});
 });

 it('should check localStorage when redirecting', function(done) {
   var HomeView = require('../src/js/HomeView');
   var transition = {};
   transition.redirect = function(loc) {
     assert.equal('/group/group/type/typeId', loc);
     done();
   };

   global.localStorage.group = 'group';
   global.localStorage.type = 'type';
   global.localStorage.typeId = 'typeId';

   HomeView.willTransitionTo(transition, {}, {}, function() {})
 });

 it('should not render anything', function() {
   var HomeView = require('../src/js/HomeView');
   var view = new HomeView();

   assert.equal(false, view.render());
 })
});
