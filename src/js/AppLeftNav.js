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
    this._onHeaderClick = this._onHeaderClick.bind(this);
  }

  getStyles() {
    return {
      fontSize: '14px',
      lineHeight: '24px'
    };
  }

  getHeaderStyles() {
    return {
      cursor: 'pointer',
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.blueGrey500,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '0px'
    };
  }

  render() {
    let header = (
      <div style={this.getHeaderStyles()} onTouchTap={this._onHeaderClick}>
        shuttle
      </div>
    );

    return (
      <LeftNav id={this.props.id}
        ref='leftNav'
        header={header}
        docked={false}
        isInitiallyOpen={true}
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

  _onHeaderClick() {
    this.context.router.transitionTo('root');
    this.refs.leftNav.close();
  }

}

AppLeftNav.propTypes = {
  menuItems: ReactPropTypes.array.isRequired
};

AppLeftNav.contextTypes = {
  router: React.PropTypes.func
};
