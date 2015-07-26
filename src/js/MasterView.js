import React from 'react';
import Router from 'react-router';
let RouteHandler = Router.RouteHandler;

import { AppBar, AppCanvas, ClearFix, Styles } from 'material-ui';
let ThemeManager = new Styles.ThemeManager();

import NavViewActions from './NavViewActions';
import NavStore from './NavStore';
import AppLeftNav from './AppLeftNav';

class MasterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { menuItems: NavStore.getMenuItems() };
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
  
  componentDidMount() {
    NavStore.addChangeListener(this._onChange.bind(this));
    NavViewActions.update();
  }
  
  componentWillUnmount() {
    NavStore.removeChangeListener(this._onChange.bind(this));
  }
  
  render() {
    var groupStyle = {
      marginTop: '66px'
    };

    return (
        <AppCanvas>
          <AppBar
            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)}
            title='shuttle'
            zDepth={0}/>

          <AppLeftNav menuItems={this.state.menuItems} ref='leftNav'/>

          <ClearFix>
            <div style={groupStyle}>
              <RouteHandler/>
            </div>
          </ClearFix>

        </AppCanvas>
    );
  }

  _onLeftIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  }
  
  _onChange() {
    this.setState({ menuItems: NavStore.getMenuItems() });
  }
}

MasterView.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = MasterView;
