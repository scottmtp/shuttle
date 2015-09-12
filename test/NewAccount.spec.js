'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('new account setup', function() {
 it('should setup new accounts', function(done) {
   var NewAccountAPI = require('../src/js/NewAccountAPI');
   NewAccountAPI.initializeNewAccount(global.localStorage)
    .then(function() {
      assert.equal(1, global.localStorage.initialized);
      done();
    });
 });
});
