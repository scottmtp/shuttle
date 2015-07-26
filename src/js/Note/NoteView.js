import React from 'react';
import { Styles, Tab, Tabs, TextField } from 'material-ui';

import NoteStore from './NoteStore';
import NoteViewActions from './NoteViewActions';

export default class NoteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { note: NoteStore.getCurrentNote() };
    
    this._onChange = this._onChange.bind(this);
    this.handleDocumentChange = this.handleDocumentChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this._onSquireLoad = this._onSquireLoad.bind(this);
  }

  componentDidMount() {
    NoteStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NoteStore.removeChangeListener(this._onChange);
  }
  
  _onChange() {
    // TODO: need solution for isMounted
    // see https://github.com/facebook/react/issues/3417
    this.setState({ note: NoteStore.getCurrentNote() });
    
    if (this.editor) {
      this.editor.setHTML(this.state.note.html);
    }
  }
  
  _onSquireLoad() {
    let squireFrame = React.findDOMNode(this.refs.squireFrame);
    this.editor = squireFrame.contentWindow.editor;
    this.editor.setHTML(this.state.note.html);
    this.editor.addEventListener('input', this.handleDocumentChange);
  }
  
  handleTitleChange(e) {
    this.setState({
      note: {
        html: this.state.note.html,
        title: e.target.value
      }
    });
    
    NoteViewActions.updateNote(this.props.params.groupid, this.props.params.noteid,
      e.target.value, this.state.note.html);
  }
  
  handleDocumentChange() {
    this.setState({
      note: {
        html: this.editor.getHTML(),
        title: this.state.note.title
      }
    });
    
    NoteViewActions.updateNote(this.props.params.groupid, this.props.params.noteid,
      this.state.note.title, this.state.note.html);
  }
  
  getStyles() {
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
  }
  
  render() {
    return (
      <Tabs style={this.getStyles().tabs} tabItemContainerStyle={this.getStyles().tabItem}>
        <Tab label="View" style={this.getStyles().tab}>
          <h1 style={this.getStyles().title}>{this.state.note.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.note.html}} />
        </Tab>
        <Tab label="Edit" style={this.getStyles().tab}>
          <TextField
            floatingLabelText="Note Title"
            value={this.state.note.title}
            onChange={this.handleTitleChange} />
          <iframe ref="squireFrame" onLoad={this._onSquireLoad} style={this.getStyles().squire} src="/document.html" />
        </Tab>
      </Tabs>
    );
  }
}

NoteView.willTransitionTo = function(transition, params, query, callback) {
  NoteViewActions.getNote(params.groupid, params.noteid);
  callback();
}
