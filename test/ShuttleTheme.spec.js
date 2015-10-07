'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('app theme', function() {
 it('should be blue', function() {
   var ShuttleTheme = require('../src/js/ShuttleTheme');
   assert.equal('#1976d2', ShuttleTheme.palette.primary1Color);
 });
});
