import uuid from 'uuid';
import dbApi from './DbAPI';
import DbTypes from './DbTypes';

import ProjectViewActions from './Project/ProjectViewActions';

export default {

  initializeNewAccount: function($localStorage) {
    $localStorage.initialized = 1;
    let project = {
      _id: uuid.v4(),
      name: 'My Project',
      dbname: 's_' + uuid.v4()
    };

    let note1 = {
      _id: uuid.v4(),
      title: 'Getting Started',
      html: `<div>
<div><span style="font-size: 18px;"><b>Welcome to Shuttle!</b></span></div>
<div><br></div>
<div>Shuttle is a Todo and Note taking app with a focus on privacy. Data
is stored locally and is always in your control. We do not store your
data on our servers, even when Sharing is enabled. Data will only sync
when multiple devices with the same Sharing key are online.</div>
<div><br></div>
<div>Also, Shuttle has been optimized to work well offline and on devices of all sizes.</div>
<div><br></div>
<div>You can access Lists and Notes from the top-left menu, and you can
customize Shuttle on the Projects page!</div>
<div><br></div>
<div>Also, if you have any feedback or comments about Shuttle, we would&nbsp;
<a href="mailto:info@tryshuttle.com?subject=Shuttle feedback">love to hear from you!</a></div>
</div>`
    };

    let list1 = {
      _id: uuid.v4(),
      title: 'Shopping'
    };

    let list2 = {
      _id: uuid.v4(),
      title: 'Todo'
    };

    return dbApi.updateGroup(project)
      .then(function() {
        return dbApi.updateNote(project, note1);
      })
      .then(function() {
        return dbApi.updateList(project, list1);
      })
      .then(function() {
        return dbApi.updateList(project, list2);
      })
      .then(function() {
        ProjectViewActions.getProjects();
      });
  }
};
