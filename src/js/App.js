'use strict';

import React from 'react';
import Router from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import routes from'./Routes';

window.React = React;
injectTapEventPlugin();

Router.create({
  routes: routes,
  scrollBehavior: Router.ScrollToTopBehavior
})
.run(function (Handler) {
  React.render(<Handler/>, document.body);
});
