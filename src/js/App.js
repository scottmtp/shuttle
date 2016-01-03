'use strict';

import React from 'react';
import { render } from 'react-dom'

import { hashHistory, IndexRoute, Router, Route } from 'react-router';

import Master from './MasterView';
import Home from './HomeView';
import Project from './Project/ProjectList';
import Note from './Note/NoteView';
import List from './List/ListView';

window.React = React;

render((
  <Router history={hashHistory}>
    <Route name="root" path="/" component={Master}>
      <Route path="projects" component={Project} />
      <Route path="group/:groupid">
        <Route path="note/:noteid" component={Note} onEnter={Note.willTransitionTo} />
        <Route path="list/:listid" component={List} onEnter={List.willTransitionTo} />
      </Route>
      <IndexRoute component={Home} onEnter={Home.willTransitionTo}/>
    </Route>
  </Router>
), document.getElementById('shuttle'))
