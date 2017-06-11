'use strict';

PouchDB.plugin(require('pouchdb-adapter-memory'));
global.pouch_adapter = 'memory';

import DbTypes from '../src/js/DbTypes';
import DbAPI from '../src/js/DbAPI';

describe('db api', function() {
  beforeAll(() => {
    DbAPI.updateNote({dbname: 'testdb'}, {_id: '2d1fa458-fc89-4b59-8540-cf15d66eb93c', title: 'Getting Started', html: '<div>hello</div>'});
    DbAPI.updateList({dbname: 'testdb'}, {_id: '2068480b-f0fd-4776-ad1b-7542f0f3c0e4', title: 'Todo'});
    DbAPI.updateList({dbname: 'testdb'}, {_id: '14b67383-2ca6-42c7-9977-b0f08ea26eba', title: 'Shopping'});
  });

  it('should get a note', () => {
    var project = {dbname: 'testdb'}
    expect(DbAPI.getNote(project, '2d1fa458-fc89-4b59-8540-cf15d66eb93c')).resolves.toMatchObject({title: 'Getting Started'});
  });

  it('should get all notes', () => {
    var project = {dbname: 'testdb'}
    expect(DbAPI.getAllNotes(project)).resolves.toHaveLength(1);
  });

  it('should get all lists', () => {
    var project = {dbname: 'testdb'}
    expect(DbAPI.getAllLists(project)).resolves.toHaveLength(2);
  });
});
