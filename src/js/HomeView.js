import React from 'react';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return false;
  }

}

HomeView.willTransitionTo = function(transition, params, query, callback) {
  if (global.localStorage.group) {
    transition.redirect('/group/' + global.localStorage.group + '/' +
      global.localStorage.type + '/' + global.localStorage.typeId);
  }

  transition.redirect('projects');
  callback();
};
