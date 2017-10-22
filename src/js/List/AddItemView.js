import React from 'react';
import { RaisedButton, TextField } from 'material-ui';

import ListConstants from './ListConstants';
import ListStore from './ListStore';
import ListViewActions from './ListViewActions';

export default class AddItemView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { listItem: {text: '', status: ListConstants.STATUS_ACTIVE} };

    this.onChange = this.onChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleSetState = this.handleSetState.bind(this);
    this.handleAddItemOnEnter = this.handleAddItemOnEnter.bind(this);
  }

  onChange() {
    let value = this.refs.addItemField.getValue();
    this.handleSetState(value, ListConstants.STATUS_ACTIVE);
  }

  handleSetState(itemText, itemStatus) {
    this.setState({ listItem: {text: itemText, status: itemStatus} });
  }

  handleAddItemOnEnter(event) {
    if (event.keyCode === 13) {
      this.handleAddItem(event);
    }
  }

  handleAddItem(event) {
    let value = this.refs.addItemField.getValue();
    if (value.length === 0) {
      return;
    }

    ListViewActions.addListItem(this.props.groupId, this.props.listId, value,
      ListConstants.STATUS_ACTIVE, this.props.order);
    this.handleSetState('', ListConstants.STATUS_ACTIVE);
  }

  render() {
    return (
      <div>
        <TextField id='addListItemText' ref='addItemField' onKeyDown={this.handleAddItemOnEnter}
          value={this.state.listItem.text} onChange={this.onChange} />
        <RaisedButton id='addListItem' label='Add' onClick={this.handleAddItem} />
      </div>
    );
  }
}
