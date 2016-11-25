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
    var cmd = 'cd ' + shipit.releasePath + '; cp shuttle-init.sh /etc/init.d/shuttle;' +
      ' /usr/local/node-v6.9.1-linux-x64/bin/npm --production' +
      ' install socket.io@1.3.6 debug@2.2.0 express@4.13.3 helmet@0.10.0 letsencrypt-express@2.0.5' +
      ' jwt-simple@0.3.0 morgan@1.6.1 email-validator@1.0.3 uuid@2.0.1 async@1.4.2' +
      ' sendgrid@1.9.2 express-force-ssl@0.2.13';

    shipit.remote(cmd)
      .then(function(res) {
        return shipit.remote('update-rc.d shuttle defaults && service shuttle restart');
      })
      .then(function(res) {
        cb();
      });
  });

  shipit.on('cleaned', function() {
    shipit.start('remotebuild');
  });
};
