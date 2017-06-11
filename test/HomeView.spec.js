'use strict';
import HomeView from '../src/js/HomeView';
import { LocalStorageMock } from './mocks.js';
global.localStorage = new LocalStorageMock;

describe('home view transition', function() {
 it('should redirect to projects page', () => {
   var redirectState = function(next, loc) {
     expect(loc).toBe('projects');
   };

   HomeView.willTransitionTo(null, redirectState);
 });

 it('should check localStorage when redirecting', () => {
   var redirectState = function(next, loc) {
     expect(loc).toBe('/group/group/type/typeId');
   };

   global.localStorage.group = 'group';
   global.localStorage.type = 'type';
   global.localStorage.typeId = 'typeId';

   HomeView.willTransitionTo(null, redirectState);
 });

 it('should not render anything', function() {
   var view = new HomeView();
   expect(view.render()).toBe(false);
 })
});
