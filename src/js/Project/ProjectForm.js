import React from 'react';
import { Dialog, TextField } from 'material-ui';

import NavViewActions from '../NavViewActions';
import ProjectViewActions from './ProjectViewActions';

export default class AddItemView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { project: {_id: '', name: '', url: '', room: ''} };
    this.onChange = this.onChange.bind(this);
    this.render = this.render.bind(this);
    this.show = this.show.bind(this);
    this.save = this.save.bind(this);
  }

  save() {
    ProjectViewActions.updateProject(this.state.project);
    NavViewActions.update();
    this.refs.projectDialog.dismiss();
  }

  show(project) {
    this.setState({ project: project });
    this.refs.projectDialog.show();
  }

  onChange() {
    let name = this.refs.nameField.getValue();
    let url = this.refs.urlField.getValue();
    let room = this.refs.roomField.getValue();

    let project = this.state.project;
    project.name = name;
    project.signaller = url;
    project.room = room;

    this.setState({ project: project });
  }

  render() {
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Save', onTouchTap: this.save, ref: 'save' }
    ];

    return (
      <Dialog
        ref='projectDialog'
        title='Project Details'
        actions={standardActions}
        actionFocus='save'>

        <div>
          <TextField ref='nameField' value={this.state.project.name}
            onChange={this.onChange} floatingLabelText='Project Name'/>
        </div>

        <div>
          <TextField ref='urlField' value={this.state.project.signaller}
            onChange={this.onChange} floatingLabelText='Signaller URL'/>
        </div>

        <div>
          <TextField ref='roomField' value={this.state.project.room}
            onChange={this.onChange} floatingLabelText='Room'/>
        </div>

      </Dialog>
    );
  }
}
