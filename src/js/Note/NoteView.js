import React from 'react';
import { Styles, Tab, Tabs, TextField } from 'material-ui';
import { grey300, darkBlack } from 'material-ui/styles/colors';

import { debounce } from 'lodash';
import Quill from 'quill';

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

    this.onChange = this.onChange.bind(this);
    this.onLocalDocumentChange = debounce(this.onLocalDocumentChange.bind(this), 1000);
  }

  componentDidMount() {
    NoteStore.addChangeListener(this.onChange);
    let toolbarOpts = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],

      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['link'],
      ['clean']
    ];

    this.editor = new Quill('#editor', {
      modules: {
        'toolbar': toolbarOpts
      },
      theme: 'snow'
    });

    this.editor.pasteHTML(this.state.note.html);
    this.editor.on('text-change', this.onLocalDocumentChange);
  }

  componentWillUnmount() {
    NoteStore.removeChangeListener(this.onChange);
  }

  onChange(updateEditor) {
    this.setState(NoteStore.getState());
    if (updateEditor) {
      this.editor.pasteHTML(this.state.note.html);
    }
  }

  onLocalDocumentChange(delta, oldContents, source) {
    let html = this.refs.editor.innerHTML;
    NoteViewActions.updateNote(this.props.params.groupid, this.props.params.noteid, this.state.note.title, html);
    console.log('updating note...');
  }

  getStyles() {
    return {
      title: {
        margin: '6px'
      },
      editor: {
        borderBottom: '1px solid #eee',
        fontSize: '100%',
        zIndex: '1000'
      }
    };
  }

  render() {
    var self = this;

    if (!self.state.note) {
      return false;
    }

    let title = <h1 style={this.getStyles().title}>{self.state.note.title}</h1>;
    return (
      <div>
        <span>{title}</span>
        <div id='editor' ref='editor' className='editor_content' style={this.getStyles().editor}></div>
      </div>
    );
  }
}

NoteView.willTransitionTo = function(nextState, replaceState) {
  global.localStorage.group = nextState.params.groupid;
  global.localStorage.type = 'note';
  global.localStorage.typeId = nextState.params.noteid;

  NoteViewActions.getNote(nextState.params.groupid, nextState.params.noteid);
};
