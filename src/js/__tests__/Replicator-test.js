jest.autoMockOff();
global.localStorage = {};

describe('getGroupId', function() {
 it('should find group id in valid url', function() {
   var Replicator = require('../Replicator');
   var hashUrl = '#/group/4d858cd1-bc62-4d98-bb60-6314d0508a2b/list/2b82529c-60dd-4caf-aa4c-5d9b6d8d3146';
   var groupId = Replicator.getGroupId(hashUrl);

   expect(groupId).toBe('4d858cd1-bc62-4d98-bb60-6314d0508a2b');
 });

 it('should not find group id in an invalid url', function() {
   var Replicator = require('../Replicator');
   var hashUrl = '#/foo/4d858cd1-bc62-4d98-bb60-6314d0508a2b/bar/2b82529c-60dd-4caf-aa4c-5d9b6d8d3146';
   var groupId = Replicator.getGroupId(hashUrl);

   expect(groupId).toBe(undefined);
 });
});

describe('getListId', function() {
 it('should find list id in valid url', function() {
   var Replicator = require('../Replicator');
   var hashUrl = '#/group/4d858cd1-bc62-4d98-bb60-6314d0508a2b/list/2b82529c-60dd-4caf-aa4c-5d9b6d8d3146';
   var listId = Replicator.getListId(hashUrl);

   expect(listId).toBe('2b82529c-60dd-4caf-aa4c-5d9b6d8d3146');
 });

 it('should not find list id in an invalid url', function() {
   var Replicator = require('../Replicator');
   var hashUrl = '#/foo/4d858cd1-bc62-4d98-bb60-6314d0508a2b/bar/2b82529c-60dd-4caf-aa4c-5d9b6d8d3146';
   var listId = Replicator.getListId(hashUrl);

   expect(listId).toBe(undefined);
 });
});
