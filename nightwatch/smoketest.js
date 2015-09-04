module.exports = {
  'Projects Page' : function (browser) {
    browser.url('https://local.tryshuttle.com/#/projects');
    browser.waitForElementVisible('body', 2000);
    browser.expect.element('h1').text.to.contain('shuttle');
    browser.expect.element('h2').text.to.contain('Projects:');
    browser.end();
  }
};
