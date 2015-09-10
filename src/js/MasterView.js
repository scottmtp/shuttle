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
    this.showAppUpdateSnackbar = false;
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _onUpdateReady() {
    this.showAppUpdateSnackbar = true;
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

    if (this.showAppUpdateSnackbar) {
      this.refs.appUpdateSnackbar.show();
    }

    if (!global.localStorage.helpViewed) {
      global.localStorage.helpViewed = 1;
      this.refs.helpDialog.show();
    }

    ProjectViewActions.updateReplicators();
  }

  componentWillUnmount() {
    NavStore.removeChangeListener(this._onChange);
    NavStore.removeReplicationChangeListener(this._onReplication);
  }

  render() {
    let helpIcon = <IconButton id='helpIcon' touch={true} tooltip='Help' onTouchTap={this._onHelp}>
      <ActionHelpIcon />
    </IconButton>;

    let helpActions = [{ id: 'helpOk', text: 'Got it!' }];

    return (
        <div>
          <AppBar id='appBar'
            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
            title='shuttle'
            iconElementRight={helpIcon}
            zDepth={0}/>

          <AppLeftNav id='appLeftNav'
            menuItems={this.state.menuItems}
            docked={false}
            ref='appLeftNav'/>

          <RouteHandler/>

          <Snackbar id='replSnackbar'
            ref='replSnackbar'
            message={'Sync...'}
            autoHideDuration={5000} />

          <Snackbar id='appUpdateSnackbar'
            ref='appUpdateSnackbar'
            message={'Update ready'}
            action='refresh'
            onActionTouchTap={this._appRefresh}
            />

          <Dialog id='helpDialog' ref='helpDialog' actions={helpActions}>
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

  _onLeftIconButtonTouchTap() {
    this.refs.appLeftNav.toggle();
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
