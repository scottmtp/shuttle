import React from 'react';
import { Dialog, IconButton, IconMenu, List, ListItem, MenuItem, RaisedButton,
  Styles, TextField } from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
let { Colors } = Styles;

import NavViewActions from '../NavViewActions';
import ProjectForm from './ProjectForm';
import ProjectStore from './ProjectStore';
import ProjectViewActions from './ProjectViewActions';

let projectSort = (a, b) => a.name > b.name ? 1 : -1;

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveDeleteProject = this.saveDeleteProject.bind(this);

    this.state = {
      projects: ProjectStore.getProjects(),
      deleteProject: ProjectStore.getDeleteProject()
    };
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.onChange);
    ProjectViewActions.getProjects();
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      projects: ProjectStore.getProjects(),
      deleteProject: ProjectStore.getDeleteProject()
    });
  }

  handleEditProject(project) {
    ProjectViewActions.setActiveProject(project);
    ProjectViewActions.getActiveProjectParts(project);
    this.refs.projectForm.show();
  }

  handleNewProject() {
    let newProject = {name: 'New Project'};
    ProjectViewActions.setActiveProject(newProject);
    ProjectViewActions.getActiveProjectParts(newProject);
    this.refs.projectForm.show();
  }

  // Delete Project

  deleteProjectActions() {
    return [
      { text: 'Cancel' },
      { text: 'OK', onTouchTap: this.saveDeleteProject }
    ];
  }

  showDeleteProjectDialog(project) {
    ProjectViewActions.setDeleteProject(project);
    this.refs.deleteProjectDialog.show();
  }

  saveDeleteProject() {
    ProjectViewActions.deleteProject(this.state.deleteProject);
    NavViewActions.update();
    this.refs.deleteProjectDialog.dismiss();
  }

  render() {
    let self = this;

    if (!self.state.projects) {
      return false;
    }

    let projects = [];
    self.state.projects.sort(projectSort).forEach((project) => {
      let iconButton = (
        <IconButton touch={true}>
          <MoreVertIcon color={Colors.grey400} />
        </IconButton>
      );

      let rightIconMenu = (
        <IconMenu iconButtonElement={iconButton}>
          <MenuItem index={0} onTouchTap={this.showDeleteProjectDialog.bind(this, project)}>Delete</MenuItem>
        </IconMenu>
      );

      let listItem = <ListItem
        primaryText={project.name}
        key={project._id}
        rightIconButton={rightIconMenu}
        onTouchTap={self.handleEditProject.bind(self, project)} />;

      projects.push(listItem);
    });

    return (
      <div style={{marginLeft: '4px', marginRight: '4px'}}>
        <h2>Projects:</h2>
        <List id='projectList'>
          {projects}
        </List>
        <RaisedButton id='newProject' label='New Project' onTouchTap={self.handleNewProject.bind(self)}/>
        <ProjectForm ref='projectForm' />
        <Dialog ref='deleteProjectDialog' actions={this.deleteProjectActions()}>
          <div>
            Delete {this.state.deleteProject.name}?
          </div>
        </Dialog>
      </div>
    );
  }
}
