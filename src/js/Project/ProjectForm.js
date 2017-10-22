import React from 'react';
import { Dialog, DropDownMenu, FlatButton, IconButton, IconMenu, List, ListItem, MenuItem,
  RaisedButton, Snackbar, Styles, Tab, Tabs, TextField } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400, grey600 } from 'material-ui/styles/colors';

import dbApi from '../DbAPI';
import DbTypes from '../DbTypes';
import NavViewActions from '../NavViewActions';
import ProjectStore from './ProjectStore';
import ProjectViewActions from './ProjectViewActions';

export default class AddItemView extends React.Component {
  constructor(props) {
    super(props);

    this.state = ProjectStore.getState();

    this.onTabChange = this.onTabChange.bind(this);

    this.onStateChange = this.onStateChange.bind(this);
    this.render = this.render.bind(this);
    this.buildPartsList = this.buildPartsList.bind(this);

    this.onFormChange = this.onFormChange.bind(this);
    this.save = this.save.bind(this);

    this.standardActions = this.standardActions.bind(this);
    this.onRenamePartFormChange = this.onRenamePartFormChange.bind(this);
    this.saveRenamePart = this.saveRenamePart.bind(this);

    this.addPartActions = this.addPartActions.bind(this);
    this.onAddPartTitleChange = this.onAddPartTitleChange.bind(this);
    this.onAddPartTypeChange = this.onAddPartTypeChange.bind(this);
    this.saveAddPart = this.saveAddPart.bind(this);

    this.renamePartActions = this.renamePartActions.bind(this);
    this.deletePartActions = this.deletePartActions.bind(this);
    this.saveDeletePart = this.saveDeletePart.bind(this);

    this.requestTokenActions = this.requestTokenActions.bind(this);
    this.onRequestTokenFormChange = this.onRequestTokenFormChange.bind(this);
    this.saveRequestToken = this.saveRequestToken.bind(this);
  }

  onTabChange() {
    // resize event will force dialog resize
    setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 0);

  }

  // React methods

  componentDidMount() {
    ProjectStore.addChangeListener(this.onStateChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.onStateChange);
  }

  onStateChange() {
    this.setState(ProjectStore.getState());
  }

  // Main Dialog

  standardActions() {
    let self = this;
    const actions = [
      <FlatButton id='projectCancel' label='Cancel' secondary={true}
        onClick={ProjectViewActions.closeProjectDialog} />,
      <FlatButton id='projectSave' label='OK' primary={true} keyboardFocused={true}
        onClick={self.save} />
    ];
    return actions;
  }

  save() {
    ProjectViewActions.updateProject(this.state.activeProject);
    NavViewActions.update();
    ProjectViewActions.closeProjectDialog();

    // TODO: adding compaction run here, may want to re-evaluate
    dbApi.compactAll();
  }

  onFormChange() {
    let name = this.refs.nameField.getValue();
    let room = this.refs.roomField.getValue().trim();

    if (name && name.length) {
      ProjectViewActions.setActiveProjectValues(name, room);
    }
  }

  // Add Part Dialog

  addPartActions() {
    let self = this;
    const actions = [
      <FlatButton id='addPartCancel' label='Cancel' secondary={true}
        onClick={ProjectViewActions.closeAddPartDialog} />,
      <FlatButton id='addPartSave' label='OK' primary={true} keyboardFocused={true}
        onClick={self.saveAddPart} />
    ];
    return actions;
  }

  saveAddPart() {
    ProjectViewActions.addPart(this.state.activeProject, this.state.addPart);
    NavViewActions.update();
    ProjectViewActions.closeAddPartDialog();
  }

  onAddPartTitleChange() {
    let title = this.refs.addPartTitleField.getValue();
    ProjectViewActions.setAddPartValues(title, this.state.addPart.type);
  }

  onAddPartTypeChange(e, index, value) {
    ProjectViewActions.setAddPartValues(this.state.addPart.title, value);
  }

  // Rename Part Dialog

  renamePartActions() {
    let self = this;
    const actions = [
      <FlatButton label='Cancel' secondary={true}
        onClick={ProjectViewActions.closeRenamePartDialog} />,
      <FlatButton label='OK' primary={true} keyboardFocused={true}
        onClick={self.saveRenamePart} />
    ];
    return actions;
  }

  showRenamePartDialog(part) {
    ProjectViewActions.setRenamePart(part);
    ProjectViewActions.openRenamePartDialog();
  }

  saveRenamePart() {
    ProjectViewActions.renamePart(this.state.activeProject, this.state.renamePart);
    NavViewActions.update();
    ProjectViewActions.closeRenamePartDialog();
  }

  onRenamePartFormChange() {
    let title = this.refs.renamePartTitleField.getValue();
    ProjectViewActions.setRenamePartValue(title);
  }

  // Delete Part

  deletePartActions() {
    let self = this;
    const actions = [
      <FlatButton id='deletePartCancel' label='Cancel' secondary={true}
        onClick={ProjectViewActions.closeDeletePartDialog} />,
      <FlatButton id='deletePartSave' label='OK' primary={true} keyboardFocused={true}
        onClick={self.saveDeletePart} />
    ];
    return actions;
  }

  showDeletePartDialog(part) {
    ProjectViewActions.setDeletePart(part);
    ProjectViewActions.openDeletePartDialog();
  }

  saveDeletePart() {
    ProjectViewActions.deletePart(this.state.activeProject, this.state.deletePart);
    NavViewActions.update();
    ProjectViewActions.closeDeletePartDialog();
  }

  // Request Token

  requestTokenDialog() {
    ProjectViewActions.openRequestTokenDialog();
  }

  onRequestTokenFormChange(e) {
    ProjectViewActions.updateTokenRequestEmail(e.target.value);
  }

  requestTokenActions() {
    let self = this;
    const actions = [
      <FlatButton id='requestTokenCancel' label='Cancel' secondary={true}
        onClick={ProjectViewActions.closeRequestTokenDialog} />,
      <FlatButton id='requestTokenSave' label='OK' primary={true} keyboardFocused={true}
        onClick={self.saveRequestToken} />
    ];
    return actions;
  }

  saveRequestToken() {
    let email = this.state.requestTokenEmail.email;
    if (email && email.length) {
      ProjectViewActions.sendTokenRequest(this.state.requestTokenEmail.email);
      ProjectViewActions.closeRequestTokenDialog();
      ProjectViewActions.openTokenRequestIndicator();
    }
  }

  // Render

  buildPartsList() {
    let self = this;
    let partsList = [];
    this.state.activeProjectParts.forEach((comp) => {
      let iconButton = (
        <IconButton touch={true}>
          <MoreVertIcon color={grey400} />
        </IconButton>
      );

      let rightIconMenu = (
        <IconMenu iconButtonElement={iconButton}>
          <MenuItem onClick={self.showRenamePartDialog.bind(self, comp)}>Rename</MenuItem>
          <MenuItem onClick={self.showDeletePartDialog.bind(self, comp)}>Delete</MenuItem>
        </IconMenu>
      );

      let listItem = <ListItem
        primaryText={comp.title}
        secondaryText={'Type: ' + comp.type}
        rightIconButton={rightIconMenu}
        disableTouchRipple={true}
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
          open={this.state.projectDialogOpen}
          onRequestClose={ProjectViewActions.closeProjectDialog}
          contentStyle={{height: '80%'}}
          actions={this.standardActions()}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}>

          <Tabs onChange={this.onTabChange}>
            <Tab id='projectDetailsTab' label='Details'>
              <div>
                <TextField id='projectNameField' ref='nameField' value={this.state.activeProject.name}
                  onChange={this.onFormChange} floatingLabelText='Project Name'/>
              </div>
            </Tab>
            <Tab id='projectPartsTab' label='Parts' style={partsListStyle}>
              <List>
                {this.buildPartsList()}
              </List>
              <RaisedButton id='addProjectPartButton' label='Add' onClick={ProjectViewActions.openAddPartDialog}/>
            </Tab>
            <Tab id='projectSharingTab' label='Sharing'>
              <div>
                <TextField ref='roomField' multiLine={true} value={this.state.activeProject.room}
                  onChange={this.onFormChange} floatingLabelText='Key' style={{width: '100%'}}/>
                <RaisedButton id='requestTokenButton' label='Request Key' onClick={this.requestTokenDialog.bind(this)}/>
                <div style={{color: grey600, marginTop: '6px',
                  display: this.state.activeProject.room ? 'none' : 'block'}}>
                  You will need to request a Sharing Key to enable Sharing.
                  Sharing tokens are free and completely private!
                </div>
              </div>
            </Tab>
          </Tabs>
        </Dialog>

        <Dialog title='Add Part' ref='addPartDialog' open={this.state.addPartDialogOpen}
          actions={this.addPartActions()} onRequestClose={ProjectViewActions.closeAddPartDialog}>
          <div>
            <TextField id='addPartTitleField' ref='addPartTitleField' value={this.state.addPart.title}
              onChange={this.onAddPartTitleChange} floatingLabelText='Title'/>
          </div>
          <div>
            <label>Type</label>
            <DropDownMenu id='addPartTypeField' value={this.state.addPart.type}
              onChange={this.onAddPartTypeChange} ref='addPartTypeField'>
              <MenuItem primaryText={DbTypes.TYPE_LIST} value={DbTypes.TYPE_LIST}/>
              <MenuItem primaryText={DbTypes.TYPE_NOTE} value={DbTypes.TYPE_NOTE}/>
            </DropDownMenu>
          </div>
        </Dialog>

        <Dialog ref='renamePartDialog' open={this.state.renamePartDialogOpen}
          actions={this.renamePartActions()} onRequestClose={ProjectViewActions.closeRenamePartDialog}>
          <div>
            <TextField ref='renamePartTitleField' value={this.state.renamePart.title}
              onChange={this.onRenamePartFormChange} floatingLabelText='Name'/>
          </div>
        </Dialog>

        <Dialog ref='deletePartDialog' open={this.state.deletePartDialogOpen}
          actions={this.deletePartActions()} onRequestClose={ProjectViewActions.closeDeletePartDialog}>
          <div>
            Delete {this.state.deletePart.title}?
          </div>
        </Dialog>

        <Dialog ref='requestTokenDialog' open={this.state.requestTokenDialogOpen}
          actions={this.requestTokenActions()} onRequestClose={ProjectViewActions.closeRequestTokenDialog}>
          <p>
            A secure Sharing Key will be sent to the email below. Once you have
            received a key, you will need to enter it in the Key field for each
            device you want to sync with.
          </p>
          <div>
            <TextField ref='requestTokenEmailField' value={this.state.tokenRequestEmail.email}
              onChange={this.onRequestTokenFormChange} floatingLabelText='Email Address'/>
          </div>
        </Dialog>

        <Snackbar
          id='tokenRequestSnackbar'
          ref='tokenRequestSnackbar'
          open={this.state.tokenRequestIndicatorOpen}
          onRequestClose={ProjectViewActions.closeRequestTokenDialog}
          message={'Request sent'}
          autoHideDuration={5000} />
      </div>
    );
  }
}
