var testContext = require.context('./test', true, /^.*\.js$/); //make sure you have your directory and regex test set correctly!
testContext.keys().forEach(testContext);

var context = require.context('./src/js/', true, /^.*\.js$/);
context.keys().forEach(context);
