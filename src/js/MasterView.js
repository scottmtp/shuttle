import React from 'react';

import ActionHelpIcon from 'material-ui/lib/svg-icons/action/help-outline';
import AppBar from 'material-ui/lib/app-bar';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu';
import Snackbar from 'material-ui/lib/snackbar';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import NavViewActions from './NavViewActions';
import NavStore from './NavStore';
import AppLeftNav from './AppLeftNav';
import ShuttleTheme from './ShuttleTheme';

import ProjectViewActions from './Project/ProjectViewActions';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // Needed for onTouchTap

export default class MasterView extends React.Component {

  constructor(props) {
    super(props);
    this.state = NavStore.getState();
    this._onChange = this._onChange.bind(this);
  }

  _onUpdateReady() {
    NavViewActions.appRefreshIndicatorOpen();
  }

  _appRefresh() {
    document.location.reload(true);
  }

  _onChange() {
    this.setState(NavStore.getState());
  }

  _onReplication() {
    NavViewActions.replIndicatorOpen();
  }

  _onNavRequestChange(open, reason) {
    if (open) {
      NavViewActions.navOpen();
    } else {
      NavViewActions.navClose();
    }
  }

  _onReplIndicatorRequestClose() {
    NavViewActions.replIndicatorClose();
  }

  _onAppRefreshIndicatorRequestClose() {
    NavViewActions.appRefreshIndicatorClose();
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(ShuttleTheme)
    };
  }

  componentWillMount() {
    window.applicationCache.addEventListener('updateready', this._onUpdateReady);
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      this._onUpdateReady();
    }
  }

  componentDidMount() {
    NavStore.addChangeListener(this._onChange);
    NavStore.addReplicationChangeListener(this._onReplication);
    NavViewActions.update();
    ProjectViewActions.updateReplicators();
  }

  componentWillUnmount() {
    NavStore.removeChangeListener(this._onChange);
    NavStore.removeReplicationChangeListener(this._onReplication);
  }

  render() {
    let menuIcon = <IconButton id='menuIcon' touch={true}
      onTouchTap={NavViewActions.navOpen} tooltip='Menu'>
      <MenuIcon />
    </IconButton>;

    let helpIcon = <IconButton id='helpIcon' touch={true}
      onTouchTap={NavViewActions.helpOpen} tooltip='Help'>
      <ActionHelpIcon />
    </IconButton>;

    let helpActions = <FlatButton id='helpOk' label='Got it!' onTouchTap={NavViewActions.helpClose}/>;

    return (
        <div>
          <AppBar id='appBar'
            title='shuttle'
            iconElementLeft={menuIcon}
            iconElementRight={helpIcon}
            zDepth={0}/>

          <AppLeftNav id='appLeftNav'
            menuItems={this.state.menuItems}
            open={this.state.leftNavOpen}
            onRequestChange={this._onNavRequestChange}
            docked={false}
            ref='appLeftNav'/>

          <div id="children">
            {this.props.children}
          </div>

          <Snackbar id='replSnackbar' open={this.state.replIndicatorOpen}
            ref='replSnackbar' onRequestClose={this._onReplIndicatorRequestClose}
            message={'Sync...'}
            autoHideDuration={2000} />

          <Snackbar id='appUpdateSnackbar' open={this.state.appRefreshIndicatorOpen}
            ref='appUpdateSnackbar' onRequestClose={this._onAppRefreshIndicatorRequestClose}
            message={'Update ready'}
            action='refresh'
            onActionTouchTap={this._appRefresh}
            />

          <Dialog data-test='helpDialog' ref='helpDialog' open={this.state.helpDialogOpen} actions={helpActions}
            autoDetectWindowHeight={true} autoScrollBodyContent={true}>
            <p>
              Shuttle is a Todo and Note taking app with a focus on privacy. Data
              is stored locally and is always in your control.
            </p>
            <p>
              We do not store your data on our servers, even when Sharing is enabled.
              Data will only sync when multiple devices with the same Sharing key
              are online.
            </p>
            <p>
              You can access Lists and Notes from the top-left menu, and you can
              customize Shuttle on the Projects page!
            </p>
            <p>
              Also, if you have any feedback or comments about Shuttle, we
              would <a href='mailto:info@tryshuttle.com?subject=Shuttle feedback'>love
              to hear from you!</a>
            </p>
          </Dialog>
        </div>
    );
  }
}

MasterView.childContextTypes = {
  muiTheme: React.PropTypes.object
};
