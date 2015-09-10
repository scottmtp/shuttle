import React from 'react';
import { Dialog, DropDownMenu, IconButton, IconMenu, List, ListItem, MenuItem,
  RaisedButton, Snackbar, Styles, Tab, Tabs, TextField } from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
let { Colors } = Styles;

import dbApi from '../DbAPI';
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
      deletePart: ProjectStore.getDeletePart(),
      requestTokenEmail: ProjectStore.getTokenRequestEmail()
    };

    this.onTabChange = this.onTabChange.bind(this);

    this.onStateChange = this.onStateChange.bind(this);
    this.render = this.render.bind(this);

    this.onFormChange = this.onFormChange.bind(this);
    this.save = this.save.bind(this);

    this.onRenamePartFormChange = this.onRenamePartFormChange.bind(this);
    this.saveRenamePart = this.saveRenamePart.bind(this);

    this.onAddPartTitleChange = this.onAddPartTitleChange.bind(this);
    this.onAddPartTypeChange = this.onAddPartTypeChange.bind(this);
    this.saveAddPart = this.saveAddPart.bind(this);

    this.saveDeletePart = this.saveDeletePart.bind(this);

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
    this.setState({
      activeProject: ProjectStore.getActiveProject(),
      activeProjectParts: ProjectStore.getActiveProjectParts(),
      addPart: ProjectStore.getAddPart(),
      renamePart: ProjectStore.getRenamePart(),
      deletePart: ProjectStore.getDeletePart(),
      requestTokenEmail: ProjectStore.getTokenRequestEmail()
    });
  }

  // Main Dialog

  standardActions() {
    return [
      { id: 'projectCancel', text: 'Cancel' },
      { id: 'projectSave', text: 'Save', onTouchTap: this.save, ref: 'save' }
    ];
  }

  show() {
    this.refs.projectDialog.show();
  }

  save() {
    ProjectViewActions.updateProject(this.state.activeProject);
    NavViewActions.update();
    this.refs.projectDialog.dismiss();

    // TODO: adding compaction run here, may want to re-evaluate
    dbApi.compactAll();
  }

  onFormChange() {
    let name = this.refs.nameField.getValue().trim();
    let room = this.refs.roomField.getValue().trim();

    if (name && name.length) {
      ProjectViewActions.setActiveProjectValues(name, room);
    }
  }

  // Add Part Dialog

  addPartActions() {
    return [
      { id: 'addPartCancel', text: 'Cancel' },
      { id: 'addPartSave', text: 'Save', onTouchTap: this.saveAddPart }
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

  onAddPartTitleChange(e) {
    let title = this.refs.addPartTitleField.getValue();
    let type = this.refs.addPartTypeField.getInputNode().value;

    ProjectViewActions.setAddPartValues(title, type);
  }

  onAddPartTypeChange(e, selectedIndex, menuItem) {
    let title = this.refs.addPartTitleField.getValue();

    ProjectViewActions.setAddPartValues(title, menuItem.payload);
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

  // Request Token

  requestTokenDialog() {
    this.refs.requestTokenDialog.show();
  }

  onRequestTokenFormChange(e) {
    ProjectViewActions.updateTokenRequestEmail(e.target.value);
  }

  requestTokenActions() {
    return [
      { text: 'Cancel' },
      { text: 'Send Request', onTouchTap: this.saveRequestToken }
    ];
  }

  saveRequestToken() {
    let email = this.state.requestTokenEmail.email;
    if (email && email.length) {
      ProjectViewActions.sendTokenRequest(this.state.requestTokenEmail.email);
      this.refs.requestTokenDialog.dismiss();
      this.refs.tokenRequestSnackbar.show();
    }
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
          contentStyle={{height: '80%'}}
          actions={this.standardActions()}
          actionFocus='save'
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
              <RaisedButton id='addProjectPartButton' label='Add' onTouchTap={this.showAddPartDialog.bind(this)}/>
            </Tab>
            <Tab id='projectSharingTab' label='Sharing'>
              <div>
                <TextField ref='roomField' multiLine={true} value={this.state.activeProject.room}
                  onChange={this.onFormChange} floatingLabelText='Key' style={{width: '100%'}}/>
                <RaisedButton id='requestTokenButton' label='Request Key' onTouchTap={this.requestTokenDialog.bind(this)}/>
              </div>
            </Tab>
          </Tabs>
        </Dialog>

        <Dialog title='Add Part' ref='addPartDialog' actions={this.addPartActions()}>
          <div>
            <TextField id='addPartTitleField' ref='addPartTitleField' value={this.state.addPart.title}
              onChange={this.onAddPartTitleChange} floatingLabelText='Title'/>
          </div>
          <div>
            <label>Type</label>
            <DropDownMenu id='addPartTypeField' onChange={this.onAddPartTypeChange} ref='addPartTypeField' menuItems={[
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

        <Dialog ref='requestTokenDialog' actions={this.requestTokenActions()}>
          <p>
            A secure Sharing Key will be sent to the email below. Once you have
            received a key, you will need to enter it in the Key field for each
            device you want to sync with.
          </p>
          <div>
            <TextField ref='requestTokenEmailField' value={this.state.requestTokenEmail.email}
              onChange={this.onRequestTokenFormChange} floatingLabelText='Email Address'/>
          </div>
        </Dialog>

        <Snackbar
          id='tokenRequestSnackbar'
          ref='tokenRequestSnackbar'
          message={'Request sent'}
          autoHideDuration={5000} />
      </div>
    );
  }
}
