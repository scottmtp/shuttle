module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/usr/local/shuttle/workspace',
      deployTo: '/usr/local/shuttle/deploy',
      repositoryUrl: process.env.REPOPATH,
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 3,
      key: process.env.KEYPATH,
      shallowClone: true
    },
    production: {
      branch: 'master',
      servers: 'root@www.tryshuttle.com'
    }
  });

  shipit.on('fetched', function() {
    shipit.start('build');
  });

  shipit.blTask('build', function (cb) {
    shipit.local('mkdir dist/', {cwd: shipit.config.workspace})
      .then(function(res) {
        return shipit.local('npm install', {cwd: shipit.config.workspace});
      })
      .then(function(res) {
        return shipit.local('npm run productiondist', {cwd: shipit.config.workspace});
      })
      .then(function(res) {
        cb();
      });
  });

  shipit.blTask('remotebuild', function (cb) {
    var cmd = 'cd ' + shipit.releasePath + ' && /usr/local/iojs-v3.2.0-linux-x64/bin/npm ' +
      'install socket.io@1.3.6 debug@2.2.0 express@4.13.3 helmet@0.10.0 jwt-simple@0.3.0 morgan@1.6.1';
    shipit.remote(cmd)
      .then(function(res) {
        cb();
      });
  });

  shipit.on('cleaned', function() {
    shipit.start('remotebuild');
  });
};
