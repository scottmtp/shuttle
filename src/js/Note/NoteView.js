import React from 'react';
import { Styles, Tab, Tabs, TextField } from 'material-ui';
import _ from 'lodash';
import Quill from 'quill';

import Toolbar from './Toolbar';

import NavViewActions from '../NavViewActions';
import NoteStore from './NoteStore';
import NoteViewActions from './NoteViewActions';

export default class NoteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = NoteStore.getState();

    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

    this._onChange = this._onChange.bind(this);
    this.handleDocumentChange = this.handleDocumentChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleNavUpdate = _.throttle(this.handleNavUpdate.bind(this), 200);
  }

  componentDidMount() {
    NoteStore.addChangeListener(this._onChange);
    this.editor = new Quill(this.refs.editor, {
      modules: {
        'toolbar': { container: '#full-toolbar' },
        'link-tooltip': true
      },
      theme: 'snow'
    });

    this.editor.setHTML(this.state.note.html);
    this.editor.on('text-change', this.handleDocumentChange);
  }

  componentWillUnmount() {
    NoteStore.removeChangeListener(this._onChange);
  }

  handleNavUpdate() {
    NavViewActions.update();
  }

  _onChange(updateEditor) {
    this.setState(NoteStore.getState());
    if (updateEditor) {
      this.editor.setHTML(this.state.note.html);
    }
  }

  handleTitleChange(e) {
    let newTitle = e.target.value;
    if (newTitle !== this.state.note.title) {
      NoteViewActions.localUpdateNote(newTitle, this.state.note.html);
      NoteViewActions.updateNote(this.props.params.groupid, this.props.params.noteid,
        newTitle, this.state.note.html);

      // delay update of left nav to ensure document was written
      _.delay(this.handleNavUpdate, 200);
    }
  }

  handleDocumentChange(delta, source) {
    let html = this.editor.getHTML();
    if (source === 'user' && html !== this.state.note.html) {
      NoteViewActions.localUpdateNote(this.state.note.title, html);
      NoteViewActions.updateNote(this.props.params.groupid, this.props.params.noteid,
        this.state.note.title, html);
    }
  }

  getStyles() {
    return {
      title: {
        marginBottom: '6px'
      },
      tabItem: {
        backgroundColor: Styles.Colors.grey300
      },
      tab: {
        color: Styles.Colors.black
      },
      tabContent: {
        marginLeft: '6px',
        marginRight: '6px',
        fontFamily: 'Source Sans Pro, sans-serif'
      }
    };
  }

  render() {
    var self = this;

    if (!self.state.note) {
      return false;
    }

    return (
      <Tabs tabItemContainerStyle={self.getStyles().tabItem}>
        <Tab id='noteViewTab' label='View' style={self.getStyles().tab}>
          <div style={self.getStyles().tabContent}>
            <h1 style={this.getStyles().title}>{self.state.note.title}</h1>
            <div id='noteContainer' dangerouslySetInnerHTML={{__html: self.state.note.html}} />
          </div>
        </Tab>
        <Tab id='noteEditTab' label='Edit' style={self.getStyles().tab}>
          <div style={self.getStyles().tabContent}>
            <TextField
              id='noteEditTitleField'
              floatingLabelText='Note Title'
              value={self.state.note.title}
              onChange={self.handleTitleChange} />
            <Toolbar />
            <div id='editor' ref='editor' className='editor_content' style={{borderBottom: '1px solid #eee'}}></div>
          </div>
        </Tab>
      </Tabs>
    );
  }
}

NoteView.willTransitionTo = function(nextState, replaceState) {
  global.localStorage.group = nextState.params.groupid;
  global.localStorage.type = 'note';
  global.localStorage.typeId = nextState.params.noteid;

  NoteViewActions.getNote(nextState.params.groupid, nextState.params.noteid);
};
