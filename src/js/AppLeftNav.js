import React from 'react';
let ReactPropTypes = React.PropTypes;

import LeftNav from 'material-ui/lib/left-nav';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import Colors from 'material-ui/lib/styles/colors';
import ListIcon from 'material-ui/lib/svg-icons/editor/format-list-bulleted';
import NoteIcon from 'material-ui/lib/svg-icons/editor/insert-drive-file';

import DbTypes from './DbTypes';
import NavViewActions from './NavViewActions';
import ShuttleTheme from './ShuttleTheme';

export default class AppLeftNav extends React.Component {

  constructor(props) {
    super(props);

    this._getMenuHeader = this._getMenuHeader.bind(this);
    this._getRouteMenuItem = this._getRouteMenuItem.bind(this);
    this._getProjectMenuItem = this._getProjectMenuItem.bind(this);
    this._getMenuItems = this._getMenuItems.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
  }

  _getSubHeaderStyle() {
    return {
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: ShuttleTheme.palette.primary1Color
    };
  }

  _getProjectHeaderStyle() {
    return {
      color: ShuttleTheme.palette.primary1Color
    };
  }

  _getActiveStyle() {
    return {
      color: ShuttleTheme.palette.accent1Color,
      marginLeft: 0
    };
  }

  _getMenuHeader() {
    let menuItem = <MenuItem key='m' style={this._getSubHeaderStyle()}
      disabled={true}>Menu</MenuItem>;

    return menuItem;
  }

  _getLeftIcon(elem) {
    let leftIcon;
    if (elem.type === DbTypes.TYPE_LIST) {
      leftIcon = <ListIcon style={{height: '16px', width: '16px'}}/>
    } else if (elem.type === DbTypes.TYPE_NOTE) {
      leftIcon = <NoteIcon style={{height: '16px', width: '16px'}}/>
    }

    return leftIcon;
  }

  _getRouteMenuItem(elem, index) {
    let self = this;
    let basicStyle = {};

    let ott = function() {
      self.context.router.push(elem.route);
      if (!self.props.docked) {
        NavViewActions.navClose();
      }
    };

    let style = self.context.router.isActive(elem.route) ? this._getActiveStyle() : basicStyle;
    let menuItem = <MenuItem key={'mi_' + index} onTouchTap={ott} rightIcon={this._getLeftIcon(elem)}
      style={style}>{elem.text}</MenuItem>;

    return menuItem;
  }

  _getProjectMenuItem(elem, index) {
    let menuItem = <MenuItem key={'mi_' + index} style={this._getProjectHeaderStyle()}
      disabled={true}>{elem.text}</MenuItem>;

    return menuItem;
  }

  _getMenuItems() {
    let menuItems = [];

    if (!this.props.docked) {
      menuItems.push(this._getMenuHeader());
      menuItems.push(<Divider key='d' />);
    }

    this.props.menuItems.forEach((elem, i) => {
      if (elem.route) {
        menuItems.push(this._getRouteMenuItem(elem, i));
        if (i === 0) {
          menuItems.push(<Divider key='d0' />);
        }
      } else {
        menuItems.push(this._getProjectMenuItem(elem, i));
      }

    });

    return menuItems;
  }

  getWidth() {
    let width = this.refs.leftNav.getStyles().root.width;
    return width;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.open !== nextProps.open) {
      return true;
    }

    if (this.props.docked !== nextProps.docked) {
      return true;
    }

    if (this.props.menuItems.length !== nextProps.menuItems.length) {
      return true;
    }

    for (let i = 0; i < this.props.menuItems.length; i++) {
      if (this.props.menuItems[i].text !== nextProps.menuItems[i].text) {
        return true;
      }
    }

    return false;
  }

  render() {
    let menuItems = this._getMenuItems();

    return (
      <LeftNav id={this.props.id} ref='leftNav' open={this.props.open}
        onRequestChange={this.props.onRequestChange} docked={this.props.docked}
        style={{overflowY: 'scroll', borderRight: '1px solid #e0e0e0', boxShadow: 'none'}}>
        {menuItems}
      </LeftNav>
    );
  }
}

AppLeftNav.propTypes = {
  menuItems: ReactPropTypes.array.isRequired
};

AppLeftNav.contextTypes = {
  router: React.PropTypes.object
};
