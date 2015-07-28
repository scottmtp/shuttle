import React from 'react';
import Router from 'react-router';
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

import Master from './MasterView';
import Home from './HomeView';
import Settings from './SettingsView';
import Note from './Note/NoteView';
import List from './List/ListView';

let AppRoutes = (
  <Route name="root" path="/" handler={Master}>
    <Route name="group/:groupid">
      <Route name="settings" handler={Settings} />
      <Route name="note/:noteid" handler={Note} />
      <Route name="list/:listid" handler={List} />
    </Route>
    <DefaultRoute handler={Home}/>
  </Route>
);

export default AppRoutes;
