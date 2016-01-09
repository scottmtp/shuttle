import React from 'react';
import { Checkbox, List, ListItem, RaisedButton, Snackbar, Styles, Tab, Tabs,
  TextField } from 'material-ui';
import ModeEditIcon from 'material-ui/lib/svg-icons/editor/mode-edit';

import AddItemView from './AddItemView';
import ListConstants from './ListConstants';
import ListStore from './ListStore';
import ListViewActions from './ListViewActions';

export default class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

    this._onChange = this._onChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);

    this.state = ListStore.getState();
  }

  componentDidMount() {
    ListStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ListStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(ListStore.getState());
  }

  _onListItemUpdatedIndicatorRequestClose() {
    ListViewActions.listItemUpdatedIndicatorClose();
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
        margin: '6px',
        color: Styles.Colors.black
      },
      tabContent: {
        marginLeft: '6px',
        marginRight: '6px',
        fontFamily: 'Source Sans Pro, sans-serif'
      },
      listItem: {
        fontFamily: 'Source Sans Pro, sans-serif'
      }
    };
  }

  handleCheck(listItem, e, checked) {
    let groupId = this.props.params.groupid;
    ListViewActions.setChecked(groupId, listItem, checked);
    ListViewActions.listItemUpdatedIndicatorOpen();

    this.refs.checkboxSnackbar.undoFunction = function() {
      ListViewActions.setChecked(groupId, listItem, !checked);
    };
  }

  checkboxUndo() {
    let snackbar = this.refs.checkboxSnackbar;
    if (snackbar && snackbar.undoFunction) {
      snackbar.undoFunction();
    }
  }

  handleClearList() {
    ListViewActions.clearList(this.props.params.groupid, this.props.params.listid);
  }

  handleStartEditItem(li) {
    ListViewActions.setEditItem(li);
  }

  handleChangeEditItemValue(li, e) {
    if (e.target.value !== li.text) {
      li.text = e.target.value;
      li.dirty = true;
      ListViewActions.changeEditItemValue(li);
    }
  }

  handleUpdateEditItem(li) {
    if (li.dirty) {
      ListViewActions.updateEditItem(this.props.params.groupid, li);
    } else {
      ListViewActions.setEditItem({});
    }
  }

  render() {
    let self = this;

    if (!self.state.list) {
      return false;
    }

    let allItems = [];
    let activeItems = [];
    let completedItems = [];
    self.state.list.listItems.forEach((li) => {
      let listItem;

      if (self.state.editItem._id === li._id) {
        listItem = (<div key={'d_' + li._id}>
          <TextField
            ref='editItem'
            onChange={self.handleChangeEditItemValue.bind(self, li)}
            value={li.text}
            key={li._id} />
          <RaisedButton key={'b_' + li._id} label='Done' onTouchTap={self.handleUpdateEditItem.bind(self, li)} />
        </div>);
      } else {
        let checkbox = <Checkbox
          checked={li.status === ListConstants.STATUS_COMPLETED}
          disableTouchRipple={false}
          onCheck={self.handleCheck.bind(self, li)} />;

        listItem = <ListItem
          leftIcon={checkbox}
          primaryText={li.text}
          disableTouchRipple={true}
          style={this.getStyles().listItem}
          rightIconButton={<ModeEditIcon onTouchTap={self.handleStartEditItem.bind(self, li)} />}
          key={li._id} />;
      }

      allItems.push(listItem);

      if (li.status === ListConstants.STATUS_COMPLETED) {
        completedItems.push(listItem);
      } else {
        activeItems.push(listItem);
      }
    });

    let title = <h1 style={self.getStyles().title}>{self.state.list.title}</h1>;

    return (
      <Tabs tabItemContainerStyle={self.getStyles().tabItem}>
        <Tab label='Active' style={self.getStyles().tab}>
          <div style={self.getStyles().tabContent}>
            {title}
            <List>
              {activeItems}
            </List>
            <AddItemView groupId={self.props.params.groupid} listId={self.props.params.listid}
              order={self.state.list.listItems.length + 1} />
            <Snackbar
              open={this.state.listItemUpdatedIndicatorOpen}
              id='checkboxSnackbar' onRequestClose={self._onListItemUpdatedIndicatorRequestClose}
              ref='checkboxSnackbar'
              message={'Item updated'}
              action='undo'
              autoHideDuration={5000}
              onActionTouchTap={self.checkboxUndo.bind(self)} />
          </div>
        </Tab>
        <Tab label='Completed' style={self.getStyles().tab}>
          <div style={self.getStyles().tabContent}>
            {title}
            <List>
              {completedItems}
            </List>
            <RaisedButton label='Clear Completed' onTouchTap={self.handleClearList.bind(self)}/>
          </div>
        </Tab>
        <Tab label='All' style={self.getStyles().tab}>
          <div style={self.getStyles().tabContent}>
            {title}
            <List>
              {allItems}
            </List>
          </div>
        </Tab>
      </Tabs>
    );
  }
}

ListView.willTransitionTo = function(nextState, replaceState) {
  global.localStorage.group = nextState.params.groupid;
  global.localStorage.type = 'list';
  global.localStorage.typeId = nextState.params.listid;

  ListViewActions.getListItems(nextState.params.groupid, nextState.params.listid);
};
