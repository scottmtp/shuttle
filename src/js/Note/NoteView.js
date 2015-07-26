import React from 'react';
import { Styles, Tab, Tabs, TextField } from 'material-ui';

import NoteStore from './NoteStore';
import NoteActions from './NoteActions';

function getState(id) {
  return {
    note: NoteStore.getNote(id)
  };
}

let NoteView = React.createClass({
  getStyles: function() {
    return {
      title: {
        marginBottom: '6px'
      },
      tabs: {
        
      },
      tabItem: {
        backgroundColor: Styles.Colors.grey300
      },
      tab: {
        margin: '6px',
        color: Styles.Colors.black
      },
      squire: {
        width: '100%',
        height: '300px',
        border: '1px solid black'
      }
    };
  },
  
  getInitialState: function() {
    this.groupId = this.props.params.groupid;
    this.noteId = this.props.params.noteid;
    return getState(this.noteId);
  },

  componentDidMount: function() {
    NoteStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    NoteStore.removeChangeListener(this._onChange);
  },
  
  _onChange: function() {
    getState(this.noteId);
  },
  
  _onSquireLoad: function() {
    let squireFrame = React.findDOMNode(this.refs.squireFrame);
    this.editor = squireFrame.contentWindow.editor;
    this.editor.setHTML(this.state.note.__html);
    this.editor.addEventListener('input', this.handleDocumentChange);
  },
  
  handleTitleChange: function(e) {
    this.setState({
      note: {
        __html: this.state.note.__html,
        title: e.target.value
      }
    });
  },
  
  handleDocumentChange: function() {
    this.setState({
      note: {
        __html: this.editor.getHTML(),
        title: this.state.note.title
      }
    });
  },
  
  render: function() {
    return (
      <Tabs style={this.getStyles().tabs} tabItemContainerStyle={this.getStyles().tabItem}>
        <Tab label="View" style={this.getStyles().tab}>
          <h1 style={this.getStyles().title}>{this.state.note.title}</h1>
          <div dangerouslySetInnerHTML={this.state.note} />
        </Tab>
        <Tab label="Edit" style={this.getStyles().tab}>
          <TextField
            floatingLabelText="Note Title"
            value={this.state.note.title}
            onChange={this.handleTitleChange} />
          <iframe ref="squireFrame" onLoad={this._onSquireLoad} style={this.getStyles().squire} src="document.html" />
        </Tab>
      </Tabs>
    );
  }
});

module.exports = NoteView;
