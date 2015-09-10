import React from 'react';
let ReactPropTypes = React.PropTypes;

import { LeftNav, RaisedButton, Styles } from 'material-ui';
let { Colors, Spacing, Typography } = Styles;


export default class AppLeftNav extends React.Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this._getSelectedIndex = this._getSelectedIndex.bind(this);
    this._onLeftNavChange = this._onLeftNavChange.bind(this);
  }

  getHeaderStyles() {
    return {
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.blue700,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '0px'
    };
  }

  render() {
    let header = (
      <div style={this.getHeaderStyles()}>
        Menu
      </div>
    );

    return (
      <LeftNav id={this.props.id}
        ref='leftNav'
        header={header}
        docked={this.props.docked}
        menuItems={this.props.menuItems}
        selectedIndex={this._getSelectedIndex()}
        onChange={this._onLeftNavChange}/>
    );
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  _getSelectedIndex() {
    let currentItem;

    for (let i = this.props.menuItems.length - 1; i >= 0; i--) {
      currentItem = this.props.menuItems[i];
      if (currentItem.route && this.context.router.isActive(currentItem.route)) {
        return i;
      }
    }
  }

  _onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route);
  }
}

AppLeftNav.propTypes = {
  menuItems: ReactPropTypes.array.isRequired
};

AppLeftNav.contextTypes = {
  router: React.PropTypes.func
};
