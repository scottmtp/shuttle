import React from 'react';
import Router from 'react-router';
let RouteHandler = Router.RouteHandler;

import { AppBar, AppCanvas, ClearFix, Dialog, IconButton, Snackbar, Styles } from 'material-ui';
let ThemeManager = new Styles.ThemeManager();
import ActionHelpIcon from 'material-ui/lib/svg-icons/action/help-outline';

import NavViewActions from './NavViewActions';
import NavStore from './NavStore';
import AppLeftNav from './AppLeftNav';
import ShuttleTheme from './ShuttleTheme';

import ProjectViewActions from './Project/ProjectViewActions';

export default class MasterView extends React.Component {

  constructor(props) {
    super(props);
    this.state = { menuItems: NavStore.getMenuItems() };
    this._onHelp = this._onHelp.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onUpdateReady = this._onUpdateReady.bind(this);
    this._onReplication = this._onReplication.bind(this);
    this._onLeftIconButtonTouchTap = this._onLeftIconButtonTouchTap.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _onUpdateReady() {
    this.refs.appUpdateSnackbar.show();
  }

  _appRefresh() {
    document.location.reload(true);
  }

  componentWillMount() {
    ThemeManager.setTheme(new ShuttleTheme());

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
    var groupStyle = {
      marginTop: '66px'
    };

    let helpIcon = <IconButton touch={true} tooltip='Help' onTouchTap={this._onHelp}>
      <ActionHelpIcon />
    </IconButton>;

    let helpActions = [{ text: 'Got it!' }];

    return (
        <AppCanvas>
          <AppBar
            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
            title='shuttle'
            iconElementRight={helpIcon}
            zDepth={0}/>

          <AppLeftNav menuItems={this.state.menuItems} ref='leftNav'/>

          <ClearFix>
            <div style={groupStyle}>
              <RouteHandler/>
            </div>
          </ClearFix>

          <Snackbar
            ref='replSnackbar'
            message={'Sync...'}
            autoHideDuration={5000} />

          <Snackbar
            ref='appUpdateSnackbar'
            message={'Update ready'}
            action='refresh'
            onActionTouchTap={this._appRefresh}
            />

          <Dialog ref='helpDialog' actions={helpActions}>
            <p>
              Shuttle is a Todo and Note taking app with a focus on privacy. Data
              is stored locally and is always in your control.
            </p>
            <p>
              Even when Sharing is enabled we do not store data on our servers.
              Data will only sync when multiple devices with the same Sharing key
              are online.
            </p>
            <p>
              You can access Lists and Notes from the top-left menu, and you can
              customize Shuttle on the Projects page!
            </p>
          </Dialog>
        </AppCanvas>
    );
  }

  _onLeftIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  }

  _onChange() {
    this.setState({ menuItems: NavStore.getMenuItems() });
  }

  _onReplication() {
    this.refs.replSnackbar.show();
  }

  _onHelp() {
    this.refs.helpDialog.show();

  }
}

MasterView.childContextTypes = {
  muiTheme: React.PropTypes.object
};
