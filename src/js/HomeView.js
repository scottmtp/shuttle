import React from 'react';
import ProjectList from './Project/ProjectList';

export default class MasterView extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    return (
      <div>
        <h1>Welcome to Shuttle!</h1>
        <ProjectList />
      </div>
    );
  }

}
