var assert = require('assert');

var myStepDefinitionsWrapper = function () {

  this.When(/^user visits main page$/, function () {
    browser.url("http://localhost:8000/");
  });

  this.Then(/^page has title "([^"]+)"$/, function (expectedTitle) {
    var title = browser.getTitle();
    assert.equal(title, expectedTitle);
  });
};
module.exports = myStepDefinitionsWrapper;