module.exports = {
  'Projects Page': function(browser) {
    browser.url('http://local.tryshuttle.com:8000/#/projects')
      .waitForElementVisible('#newProject', 2000);

    browser.expect.element('h1').text.to.contain('shuttle');
    browser.expect.element('h2').text.to.contain('Projects');

    browser.useXpath();
    browser.expect.element('//div[text()="My Project"]').to.be.present;
  },

  'Create Project': function(browser) {
    browser.useCss()
      .click('#newProject')
      .waitForElementVisible('#projectSave', 5000)
      .clearValue('#projectNameField')
      .setValue('#projectNameField', 'nightwatch')
      .click('#projectSave')
      .pause(500);

    browser.useXpath();
    browser.expect.element('//div[text()="nightwatch"]').to.be.present;
  },

  'Edit Project:': function(browser) {
    browser.useXpath()
      .click('//*[@id="projectList"]/div[2]/span');

    browser.useCss()
      .waitForElementVisible('#projectSave', 2000)
      // append '2' to name field
      .setValue('#projectNameField', '2')
      .pause(500);
  },

  'Add list parts': function(browser) {
    browser.useCss().click('#projectPartsTab')
      .waitForElementVisible('#addProjectPartButton', 20000)
      .click('#addProjectPartButton')
      .waitForElementVisible('#addPartSave', 2000)
      .clearValue('#addPartTitleField')
      .setValue('#addPartTitleField', 'nightwatchList')
      .click('#addPartSave')
      .pause(500);
  },

  'Add note part': function(browser) {
    browser.click('#addProjectPartButton')
      .waitForElementVisible('#addPartSave', 2000)
      .clearValue('#addPartTitleField')
      .setValue('#addPartTitleField', 'nightwatchNote')
      .useXpath()
      .click('//div[text()=\'list\']')
      .pause(500)
      .click('//div[text()=\'note\']')
      .useCss()
      .pause(500)
      .click('#addPartSave')
      .pause(500)

      // save project
      .click('#projectSave')
      .pause(500);

    // browser.expect.element('#projectList :nth-child(2) div[data-reactid*=primaryText]').text.to.equal('nightwatch2');
  },

  'Navigate to List': function(browser) {
    // navigate to list created in step above
    browser.useXpath()
      .click('//div[text()=\'nightwatchList\']')
      .useCss()
      .pause(500);
  },

  'Add List Items': function(browser) {
    // add a few list items
 
    // add first item using newline
    browser.setValue('#addListItemText', 'foo\n')
      .useXpath().waitForElementVisible('//*[text()=\'foo\']', 500).useCss()

      // add remaining items with button
      .setValue('#addListItemText', 'bar')
      .click('#addListItem')
      .useXpath().waitForElementVisible('//*[text()=\'bar\']', 500).useCss()

      .setValue('#addListItemText', 'baz')
      .click('#addListItem')
      .useXpath().waitForElementVisible('//*[text()=\'baz\']', 500).useCss();
  },

  'Check 2 List Items': function(browser) {
    browser.click('input[type=checkbox]')
      .waitForElementVisible('#checkboxSnackbar', 500)
      .click('input[type=checkbox]')
      .waitForElementVisible('#checkboxSnackbar', 500);
  },

  'Navigate to Note': function(browser) {
    // navigate to note created in step above
    browser.useXpath()
      .click('//div[text()=\'nightwatchNote\']')
      .useCss()
      .pause(500);
  },

  'Help Dialog': function(browser) {
    browser.click('#helpIcon')
      .waitForElementVisible('#helpOk', 2000)
      .click('#helpOk');

    browser.end();
  }
};
