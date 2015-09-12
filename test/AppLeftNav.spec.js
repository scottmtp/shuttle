'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('app left nav', function() {

  it('should render', function() {
    var menuItems = [{ type: 'SUBHEADER', text: 'project' }];
    var AppLeftNav = require('../src/js/AppLeftNav');
    var nav = new AppLeftNav({menuItems: menuItems});

    assert.equal('24px', nav.getHeaderStyles().fontSize);

    // TODO: investigate error from TestUtils.renderIntoDocument
    //
    // Error: Invariant Violation: React.render(): Invalid component element.
    // This may be caused by unintentionally loading two independent copies of React.
    //
    // var rendered = TestUtils.renderIntoDocument(nav);
    // expect(rendered).toExist();
  });
});
