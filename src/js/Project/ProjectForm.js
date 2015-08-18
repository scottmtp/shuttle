import React from 'react';
import { Dialog, IconButton, IconMenu, List, ListItem, MenuItem, RaisedButton, Styles, Tab, Tabs, TextField } from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
let { Colors } = Styles;

import NavViewActions from '../NavViewActions';
import ProjectStore from './ProjectStore';
import ProjectViewActions from './ProjectViewActions';

export default class AddItemView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: ProjectStore.getActiveProject(),
      components: ProjectStore.getComponents()
    };

    this.onChange = this.onChange.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.render = this.render.bind(this);
    this.show = this.show.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      project: ProjectStore.getActiveProject(),
      components: ProjectStore.getComponents()
    });
  }

  save() {
    ProjectViewActions.updateProject(this.state.project);
    NavViewActions.update();
    this.refs.projectDialog.dismiss();
  }

  show() {
    this.refs.projectDialog.show();
  }

  onFormChange() {
    let name = this.refs.nameField.getValue();
    let url = this.refs.urlField.getValue();
    let room = this.refs.roomField.getValue();
    ProjectViewActions.setActiveProjectValues(name, url, room);
  }

  renameItem(comp) {
    console.log('renameItem');
  }

  deleteItem(comp) {
    console.log('deleteItem');
  }

  render() {
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Save', onTouchTap: this.save, ref: 'save' }
    ];

    let componentsList = [];
    this.state.components.forEach((comp) => {
      let iconButton = (
        <IconButton touch={true}>
          <MoreVertIcon color={Colors.grey400} />
        </IconButton>
      );

      let rightIconMenu = (
        <IconMenu iconButtonElement={iconButton}>
          <MenuItem index={0} onTouchTap={this.renameItem.bind(this, comp)}>Rename</MenuItem>
          <MenuItem index={1} onTouchTap={this.deleteItem.bind(this, comp)}>Delete</MenuItem>
        </IconMenu>
      );

      let listItem = <ListItem
        primaryText={comp.title}
        rightIconButton={rightIconMenu}
        key={comp._id} />

      componentsList.push(listItem);
    });

    return (
      <Dialog
        ref='projectDialog'
        actions={standardActions}
        actionFocus='save'>

        <Tabs>
          <Tab label='Project Details'>
            <div>
              <TextField ref='nameField' value={this.state.project.name}
                onChange={this.onFormChange} floatingLabelText='Project Name'/>
            </div>
          </Tab>
          <Tab label='Components'>
            <List>
              {componentsList}
            </List>
            <RaisedButton label='Add Component' />
          </Tab>
          <Tab label='Replication'>
            <div>
              <TextField ref='urlField' value={this.state.project.signaller}
                onChange={this.onFormChange} floatingLabelText='Signaller URL'/>
            </div>
            <div>
              <TextField ref='roomField' value={this.state.project.room}
                onChange={this.onFormChange} floatingLabelText='Room'/>
            </div>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
}
