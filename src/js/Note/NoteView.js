import React from 'react';
import { Styles, Tab, Tabs, TextField } from 'material-ui';
import _ from 'lodash';

import NavViewActions from '../NavViewActions';
import NoteStore from './NoteStore';
import NoteViewActions from './NoteViewActions';

export default class NoteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { note: NoteStore.getCurrentNote() };

    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

    this._onSquireLoad = this._onSquireLoad.bind(this);
    this._onChange = this._onChange.bind(this);
    this.handleDocumentChange = this.handleDocumentChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleNewState = this.handleNewState.bind(this);

    this.handleDocUpdate = _.throttle(this.handleDocUpdate.bind(this), 200);
    this.handleNavUpdate = _.throttle(this.handleNavUpdate.bind(this), 200);
  }

  componentDidMount() {
    NoteStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NoteStore.removeChangeListener(this._onChange);
  }

  handleNavUpdate() {
    NavViewActions.update();
  }

  handleDocUpdate(groupId, noteId, title, markup) {
    NoteViewActions.updateNote(groupId, noteId, title, markup);
  }

  handleNewState(title, markup) {
    this.setState({
      note: {
        html: markup,
        title: title
      }
    });
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
    var newTitle = e.target.value;

    this.handleNewState(newTitle, this.state.note.html);
    this.handleDocUpdate(this.props.params.groupid, this.props.params.noteid,
      newTitle, this.state.note.html);

    // delay update of left nav to ensure document was written
    _.delay(this.handleNavUpdate, 200);
  }

  handleDocumentChange() {
    var newHtml = this.editor.getHTML();

    this.handleNewState(this.state.note.title, newHtml);
    this.handleDocUpdate(this.props.params.groupid, this.props.params.noteid,
      this.state.note.title, newHtml);
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
    var self = this;

    if (!self.state.note) {
      return (<div></div>);
    }

    return (
      <Tabs style={self.getStyles().tabs} tabItemContainerStyle={self.getStyles().tabItem}>
        <Tab label="View" style={self.getStyles().tab}>
          <h1 style={this.getStyles().title}>{self.state.note.title}</h1>
          <div dangerouslySetInnerHTML={{__html: self.state.note.html}} />
        </Tab>
        <Tab label="Edit" style={self.getStyles().tab}>
          <TextField
            floatingLabelText="Note Title"
            value={self.state.note.title}
            onChange={self.handleTitleChange} />
          <iframe ref="squireFrame" onLoad={self._onSquireLoad} style={self.getStyles().squire} src="/document.html" />
        </Tab>
      </Tabs>
    );
  }
}

NoteView.willTransitionTo = function(transition, params, query, callback) {
  NoteViewActions.getNote(params.groupid, params.noteid);
  callback();
};
