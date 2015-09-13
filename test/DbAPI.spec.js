'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

var DbTypes = require('../src/js/DbTypes');
var injector = require('inject?pouchdb!../src/js/DbAPI')

var allDocs = {
  "total_rows": 3,
  "offset": 0,
  "rows": [
    {
      "id": "14b67383-2ca6-42c7-9977-b0f08ea26eba",
      "key": "14b67383-2ca6-42c7-9977-b0f08ea26eba",
      "value": {
        "rev": "1-aedd4a5fbbd42351c171410b7aba6cd8"
      },
      "doc": {
        "title": "Shopping",
        "type": "list",
        "_id": "14b67383-2ca6-42c7-9977-b0f08ea26eba",
        "_rev": "1-aedd4a5fbbd42351c171410b7aba6cd8"
      }
    },
    {
      "id": "2068480b-f0fd-4776-ad1b-7542f0f3c0e4",
      "key": "2068480b-f0fd-4776-ad1b-7542f0f3c0e4",
      "value": {
        "rev": "1-42c303813e0b19fe498625f81f270503"
      },
      "doc": {
        "title": "Todo",
        "type": "list",
        "_id": "2068480b-f0fd-4776-ad1b-7542f0f3c0e4",
        "_rev": "1-42c303813e0b19fe498625f81f270503"
      }
    },
    {
      "id": "2d1fa458-fc89-4b59-8540-cf15d66eb93c",
      "key": "2d1fa458-fc89-4b59-8540-cf15d66eb93c",
      "value": {
        "rev": "1-b306cb916b45821bbd4d617a6ba13cd9"
      },
      "doc": {
        "title": "Getting Started",
        "html": "<div>hello</div>",
        "type": "note",
        "_id": "2d1fa458-fc89-4b59-8540-cf15d66eb93c",
        "_rev": "1-b306cb916b45821bbd4d617a6ba13cd9"
      }
    }
  ]
};

describe('db api', function() {
  var PouchDBMock = class {
    get(id) {
      return Promise.resolve({_id: id});
    }

    allDocs(opts) {
      return Promise.resolve(allDocs);
    }
  }

  var DbAPI = injector({
    'pouchdb': PouchDBMock,
  })

  it('should get a group', function(done) {
    DbAPI.getGroup(1234)
      .then(function(group) {
        assert.equal(1234, group._id);
        done();
      });
  });

  it('should get a note', function(done) {
    var project = {dbname: 'testdb'}
    DbAPI.getNote(project, 2345)
      .then(function(note) {
        assert.equal(2345, note._id);
        done();
      });
  });

  it('should get all notes', function(done) {
    var project = {dbname: 'testdb'}
    DbAPI.getAllNotes(project)
      .then(function(results) {
        assert.equal(1, results.length);
        done();
      });
  });

  it('should get all lists', function(done) {
    var project = {dbname: 'testdb'}
    DbAPI.getAllLists(project)
      .then(function(results) {
        assert.equal(2, results.length);
        done();
      });
  });

  it('should get components', function(done) {
    var project = {dbname: 'testdb'}
    DbAPI.getComponents(project)
      .then(function(results) {
        assert.equal(3, results.length);
        assert.equal('Shopping', results[0].title);
        assert.equal('Todo', results[1].title);
        assert.equal('Getting Started', results[2].title);
        done();
      });
  });

});
