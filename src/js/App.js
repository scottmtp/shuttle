'use strict';

import React from 'react';
import Router from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import routes from'./Routes';
// let historyLocation = Router.HistoryLocation;

window.React = React;
injectTapEventPlugin();

Router.create({
  routes: routes,
  scrollBehavior: Router.ScrollToTopBehavior,
//  location: historyLocation
})
.run(function (Handler) {
  React.render(<Handler/>, document.body);
});
