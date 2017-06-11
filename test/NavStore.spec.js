'use strict';
import NavActions from '../src/js/NavActions';
import NavViewActions from '../src/js/NavViewActions';
import NavStore from '../src/js/NavStore';

PouchDB.plugin(require('pouchdb-adapter-memory'));
global.pouch_adapter = 'memory';

describe('nav event dispatch', function() {

 it('should update menu items', () => {
   var menuItems = ['a', 'b', 'c'];
   NavStore.addChangeListener(function() {
     var state = NavStore.getState();
     expect(state.menuItems).toBe(menuItems);
   });

   NavActions.receiveUpdate(menuItems);
 });

});
