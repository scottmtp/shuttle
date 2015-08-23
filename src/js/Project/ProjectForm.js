import React from 'react';
import { Dialog, DropDownMenu, IconButton, IconMenu, List, ListItem, MenuItem,
  RaisedButton, Styles, Tab, Tabs, TextField } from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
let { Colors } = Styles;

import DbTypes from '../DbTypes';
import NavViewActions from '../NavViewActions';
import ProjectStore from './ProjectStore';
import ProjectViewActions from './ProjectViewActions';

export default class AddItemView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProject: ProjectStore.getActiveProject(),
      activeProjectParts: ProjectStore.getActiveProjectParts(),
      addPart: ProjectStore.getAddPart(),
      renamePart: ProjectStore.getRenamePart(),
      deletePart: ProjectStore.getDeletePart()
    };

    this.onStateChange = this.onStateChange.bind(this);
    this.render = this.render.bind(this);

    this.onFormChange = this.onFormChange.bind(this);
    this.save = this.save.bind(this);

    this.onRenamePartFormChange = this.onRenamePartFormChange.bind(this);
    this.saveRenamePart = this.saveRenamePart.bind(this);

    this.onAddPartFormChange = this.onAddPartFormChange.bind(this);
    this.saveAddPart = this.saveAddPart.bind(this);

    this.saveDeletePart = this.saveDeletePart.bind(this);
  }

  // React methods

  componentDidMount() {
    ProjectStore.addChangeListener(this.onStateChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.onStateChange);
  }

  onStateChange() {
    this.setState({
      activeProject: ProjectStore.getActiveProject(),
      activeProjectParts: ProjectStore.getActiveProjectParts(),
      addPart: ProjectStore.getAddPart(),
      renamePart: ProjectStore.getRenamePart(),
      deletePart: ProjectStore.getDeletePart()
    });
  }

  // Main Dialog

  standardActions() {
    return [
      { text: 'Cancel' },
      { text: 'Save', onTouchTap: this.save, ref: 'save' }
    ];
  }

  show() {
    this.refs.projectDialog.show();
  }

  save() {
    ProjectViewActions.updateProject(this.state.activeProject);
    NavViewActions.update();
    this.refs.projectDialog.dismiss();
  }

  onFormChange() {
    let name = this.refs.nameField.getValue();
    let url = this.refs.urlField.getValue();
    let room = this.refs.roomField.getValue();
    ProjectViewActions.setActiveProjectValues(name, url, room);
  }

  // Add Part Dialog

  addPartActions() {
    return [
      { text: 'Cancel' },
      { text: 'Save', onTouchTap: this.saveAddPart }
    ];
  }

  showAddPartDialog() {
    this.refs.addPartDialog.show();
  }

  saveAddPart() {
    ProjectViewActions.addPart(this.state.activeProject, this.state.addPart);
    NavViewActions.update();
    this.refs.addPartDialog.dismiss();
  }

  onAddPartFormChange() {
    let title = this.refs.addPartTitleField.getValue();
    let type = this.refs.addPartTypeField.getInputNode().value;
    ProjectViewActions.setAddPartValues(title, type);
  }

  // Rename Part Dialog

  renamePartActions() {
    return [
      { text: 'Cancel' },
      { text: 'Save', onTouchTap: this.saveRenamePart }
    ];
  }

  showRenamePartDialog(part) {
    ProjectViewActions.setRenamePart(part);
    this.refs.renamePartDialog.show();
  }

  saveRenamePart() {
    ProjectViewActions.renamePart(this.state.activeProject, this.state.renamePart);
    NavViewActions.update();
    this.refs.renamePartDialog.dismiss();
  }

  onRenamePartFormChange() {
    let title = this.refs.renamePartTitleField.getValue();
    ProjectViewActions.setRenamePartValue(title);
  }

  // Delete Part

  deletePartActions() {
    return [
      { text: 'Cancel' },
      { text: 'OK', onTouchTap: this.saveDeletePart }
    ];
  }

  showDeletePartDialog(part) {
    ProjectViewActions.setDeletePart(part);
    this.refs.deletePartDialog.show();
  }

  saveDeletePart() {
    ProjectViewActions.deletePart(this.state.activeProject, this.state.deletePart);
    NavViewActions.update();
    this.refs.deletePartDialog.dismiss();
  }

  // Render

  buildPartsList() {
    let partsList = [];
    this.state.activeProjectParts.forEach((comp) => {
      let iconButton = (
        <IconButton touch={true}>
          <MoreVertIcon color={Colors.grey400} />
        </IconButton>
      );

      let rightIconMenu = (
        <IconMenu iconButtonElement={iconButton}>
          <MenuItem index={0} onTouchTap={this.showRenamePartDialog.bind(this, comp)}>Rename</MenuItem>
          <MenuItem index={1} onTouchTap={this.showDeletePartDialog.bind(this, comp)}>Delete</MenuItem>
        </IconMenu>
      );

      let listItem = <ListItem
        primaryText={comp.title}
        rightIconButton={rightIconMenu}
        key={comp._id} />;

      partsList.push(listItem);
    });

    return partsList;
  }

  render() {
    let showPartsList = this.state.activeProject._id ? true : false;
    let partsListStyle = showPartsList ? {} : {display: 'none'};

    return (
      <div>
        <Dialog
          ref='projectDialog'
          actions={this.standardActions()}
          actionFocus='save'>

          <Tabs>
            <Tab label='Details'>
              <div>
                <TextField ref='nameField' value={this.state.activeProject.name}
                  onChange={this.onFormChange} floatingLabelText='Project Name'/>
              </div>
            </Tab>
            <Tab label='Parts' style={partsListStyle}>
              <List>
                {this.buildPartsList()}
              </List>
              <RaisedButton label='Add' onTouchTap={this.showAddPartDialog.bind(this)}/>
            </Tab>
            <Tab label='Other'>
              <div>
                <TextField ref='urlField' value={this.state.activeProject.signaller}
                  onChange={this.onFormChange} floatingLabelText='Signaller URL'/>
              </div>
              <div>
                <TextField ref='roomField' value={this.state.activeProject.room}
                  onChange={this.onFormChange} floatingLabelText='Room'/>
              </div>
            </Tab>
          </Tabs>
        </Dialog>

        <Dialog title='Add Part' ref='addPartDialog' actions={this.addPartActions()}>
          <div>
            <TextField ref='addPartTitleField' value={this.state.addPart.title}
              onChange={this.onAddPartFormChange} floatingLabelText='Title'/>
          </div>
          <div>
            <label>Type</label>
            <DropDownMenu ref='addPartTypeField' menuItems={[
              {payload: DbTypes.TYPE_LIST, text: DbTypes.TYPE_LIST},
              {payload: DbTypes.TYPE_NOTE, text: DbTypes.TYPE_NOTE}
            ]} />
          </div>
        </Dialog>

        <Dialog ref='renamePartDialog' actions={this.renamePartActions()}>
          <div>
            <TextField ref='renamePartTitleField' value={this.state.renamePart.title}
              onChange={this.onRenamePartFormChange} floatingLabelText='Name'/>
          </div>
        </Dialog>

        <Dialog ref='deletePartDialog' actions={this.deletePartActions()}>
          <div>
            Delete {this.state.deletePart.title}?
          </div>
        </Dialog>
      </div>
    );
  }
}
