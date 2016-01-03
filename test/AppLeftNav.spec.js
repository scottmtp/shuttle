'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('app left nav', function() {

  it('should render', function() {
    var menuItems = [{ type: 'SUBHEADER', text: 'project' }];
    var AppLeftNav = require('../src/js/AppLeftNav');
    var nav = new AppLeftNav();

    // TODO: this is a stub, not a real test
  });
});
