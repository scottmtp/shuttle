import React from 'react';
import { RaisedButton, TextField } from 'material-ui';

import ListViewActions from './ListViewActions';
import ListStore from './ListStore';

export default class AddItemView extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { listItem: {text: '', status: 'active'} };
    
    this.onChange = this.onChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleSetState = this.handleSetState.bind(this);
  }
  
  onChange() {
    let value = this.refs.addItemField.getValue();
    this.handleSetState(value, 'active');
  }
  
  handleSetState(itemText, itemStatus) {
    this.setState({ listItem: {text: itemText, status: itemStatus} });
  }
  
  handleAddItem() {
    let value = this.refs.addItemField.getValue();
    if (value.length === 0) {
      return;
    }
    
    ListViewActions.addListItem(this.props.groupId, this.props.listId, value, 'active');
    this.handleSetState('', 'active');
  }
  
  render() {
    return (
      <div>
        <TextField ref='addItemField' onEnterKeyDown={this.handleAddItem} 
          value={this.state.listItem.text} onChange={this.onChange} />
        <RaisedButton label='Add' onTouchTap={this.handleAddItem} />
      </div>
    );
  }
}
