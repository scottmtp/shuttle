var testContext = require.context('./test', true, /^.*\.js$/);
testContext.keys().forEach(testContext);

var context = require.context('./src/js/', true, /^.*\.js$/);
context.keys().forEach(context);
