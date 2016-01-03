import React from 'react';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return false;
  }

}

HomeView.willTransitionTo = function(nextState, replaceState) {
  if (global.localStorage.group) {
    let path = '/group/' + global.localStorage.group + '/' +
      global.localStorage.type + '/' + global.localStorage.typeId;

    replaceState(null, path);
    return;
  }

  replaceState(null, 'projects');
};
