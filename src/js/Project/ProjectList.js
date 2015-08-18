import React from 'react';
import { List, ListItem, RaisedButton } from 'material-ui';

import ProjectForm from './ProjectForm';
import ProjectStore from './ProjectStore';
import ProjectViewActions from './ProjectViewActions';

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = { projects: ProjectStore.getProjects() };
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.onChange);
    ProjectViewActions.getProjects();
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({ projects: ProjectStore.getProjects() });
  }

  handleEditProject(project) {
    ProjectViewActions.setActiveProject(project);
    ProjectViewActions.getComponents(project);
    this.refs.projectForm.show();
  }

  handleNewProject() {
    let newProject = {name: 'New Project'};
    ProjectViewActions.setActiveProject(newProject);
    ProjectViewActions.getComponents(newProject);
    this.refs.projectForm.show();
  }

  render() {
    let self = this;

    if (!self.state.projects) {
      return (<div></div>);
    }

    let projects = [];
    self.state.projects.forEach((project) => {
      let listItem = <ListItem
        primaryText={project.name}
        key={project._id}
        onTouchTap={self.handleEditProject.bind(self, project)}/>

      projects.push(listItem);
    });

    return (
      <div>
        <h2>Projects:</h2>
        <List>
          {projects}
        </List>
        <RaisedButton label='New Project' onTouchTap={self.handleNewProject.bind(self)}/>
        <ProjectForm ref='projectForm' />
      </div>
    );
  }
}
