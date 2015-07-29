import React from 'react';
import { Checkbox, List, ListItem, Styles, Tab, Tabs, TextField } from 'material-ui';

import AddItemView from './AddItemView'
import ListStore from './ListStore';
import ListViewActions from './ListViewActions';

export default class ListView extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.state = { list: ListStore.getCurrentList() };
  }

  componentDidMount() {
    ListStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ListStore.removeChangeListener(this._onChange);
  }
  
  _onChange() {
    this.setState({ list: ListStore.getCurrentList() });
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
      }
    };
  }
  
  render() {
    let allItems = [];
    let activeItems = [];
    let completedItems = [];
    this.state.list.listItems.forEach(function(li) {
      let listItem = <ListItem
        leftCheckbox={<Checkbox />}
        primaryText={li.text}
        key={li._id} />
              
      allItems.push(listItem);
      
      if (li.status === 'completed') {
        completedItems.push(listItem);
      } else {
        activeItems.push(listItem);
      }
    });
    
    return (
      <Tabs tabItemContainerStyle={this.getStyles().tabItem}>
        <Tab label='Active' style={this.getStyles().tab}>
          <h1 style={this.getStyles().title}>{this.state.list.title}</h1>
          <List>
            {activeItems}
          </List>
          <AddItemView groupId={this.props.params.groupid} listId={this.props.params.listid} />
        </Tab>
        <Tab label='Completed' style={this.getStyles().tab}>
          <h1 style={this.getStyles().title}>{this.state.list.title}</h1>
          <List>
            {completedItems}
          </List>
        </Tab>
        <Tab label='All' style={this.getStyles().tab}>
          <h1 style={this.getStyles().title}>{this.state.list.title}</h1>
          <List>
            {allItems}
          </List>
        </Tab>
      </Tabs>
    );
  }
}

ListView.willTransitionTo = function(transition, params, query, callback) {
  ListViewActions.getListItems(params.groupid, params.listid);
  callback();
}
