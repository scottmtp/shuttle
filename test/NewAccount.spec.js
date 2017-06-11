'use strict';
import { LocalStorageMock } from './mocks.js';
global.localStorage = new LocalStorageMock;

import NewAccountAPI from '../src/js/NewAccountAPI';

describe('new account setup', function() {
 it('should setup new accounts', () => {
   NewAccountAPI.initializeNewAccount(global.localStorage)
    .then(function() {
      expect(global.localStorage.initialized).toBe(1);
    });
 });
});
