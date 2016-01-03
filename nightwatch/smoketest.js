module.exports = {
  'Projects Page': function(browser) {
    browser.url('http://local.tryshuttle.com:8000/#/projects')
      .waitForElementVisible('#newProject', 2000);

    browser.expect.element('h1').text.to.contain('shuttle');
    browser.expect.element('h2').text.to.contain('Projects');
    browser.expect.element('#projectList :nth-child(1) div[data-reactid*=primaryText]').text.to.equal('My Project');
  },

  'Create Project': function(browser) {
    browser.useCss()
      .click('#newProject')
      .waitForElementVisible('#projectSave', 5000)
      .clearValue('#projectNameField')
      .setValue('#projectNameField', 'nightwatch')
      .click('#projectSave')
      .pause(500);

    browser.expect.element('#projectList :nth-child(2) div[data-reactid*=primaryText]').text.to.equal('nightwatch');
  },

  'Edit Project:': function(browser) {
    browser.click('#projectList :nth-child(2) a')
      .waitForElementVisible('#projectSave', 2000)

      // append '2' to name field
      .setValue('#projectNameField', '2')
      .pause(500);
  },

  'Add list parts': function(browser) {
    browser.click('#projectPartsTab')
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
      .click('#addPartSave')
      .pause(500)

      // save project
      .click('#projectSave')
      .pause(500)

      // TODO: not sure why we need to click button twice here, likely
      // a material-ui bug???
      .click('#projectSave')
      .pause(500);

    browser.expect.element('#projectList :nth-child(2) div[data-reactid*=primaryText]').text.to.equal('nightwatch2');
  },

  'Navigate to List': function(browser) {
    // first button is app nav bar
    browser.click('button')
      .pause(500)

      // navigate to list created in step above
      .useXpath()
      .click('//span[text()=\'nightwatchList\']')
      .useCss()
      .pause(500);
  },

  'Add List Items': function(browser) {
    // add a few list items
    browser.setValue('#addListItemText', 'foo')
      .click('#addListItem')
      .useXpath().waitForElementVisible('//div[text()=\'foo\']', 500).useCss()

      .setValue('#addListItemText', 'bar')
      .click('#addListItem')
      .useXpath().waitForElementVisible('//div[text()=\'bar\']', 500).useCss()

      .setValue('#addListItemText', 'baz')
      .click('#addListItem')
      .useXpath().waitForElementVisible('//div[text()=\'baz\']', 500).useCss();
  },

  'Check 2 List Items': function(browser) {
    browser.click('input[type=checkbox]')
      .waitForElementVisible('#checkboxSnackbar', 500)
      .click('input[type=checkbox]')
      .waitForElementVisible('#checkboxSnackbar', 500);
  },

  'Navigate to Note': function(browser) {
    // re-open nav
    browser.click('button')
      .pause(500)

      // navigate to note created in step above
      .useXpath()
      .click('//span[text()=\'nightwatchNote\']')
      .useCss()
      .pause(500);
  },

  'Add note text': function(browser) {
    var note = 'updatedNotes';
    browser.click('#noteEditTab')
      .waitForElementVisible('#noteEditTitleField', 500)
      // .setValue('#ql-editor-1', note)
      // .pause(500)
      // .click('#noteViewTab')
      // .pause(500)
      // .waitForElementVisible('#noteContainer', 500)
      
    // TODO: investigate setValue on contenteditable div
    // browser.expect.element('#noteContainer').text.to.equal(note);
  },

  'Help Dialog': function(browser) {
    browser.click('#helpIcon')
      .waitForElementVisible('#helpOk', 2000)
      .click('#helpOk');

    browser.end();
  }
};
