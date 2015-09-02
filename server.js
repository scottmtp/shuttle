var fs = require('fs');
var http = require('http');
var https = require('https');
var url = require('url');

var express = require('express');
var app = express();

var helmet = require('helmet');
var morgan = require('morgan');
var debug = require('debug')('shuttle-server');
var jwt = require('jwt-simple');

// START CONFIGURATION
var port = process.env.PORT || 80;
var sslPort = process.env.SSL_PORT || 443;
var sslPrefix = process.env.SSL_PREFIX || './keys/';
var sslKeyFile = process.env.SSL_KEY_FILE || 'key.enc.pem';
var sslCertFile = process.env.SSL_CERT_FILE || 'cert.pem';
var sslCaFile = process.env.SSL_CA_FILE || 'certchain.pem';
var jwtTokenFile = process.env.JWT_TOKEN_FILE;
// END CONFIGURATION

var sslOptions = {
  key: fs.readFileSync(sslPrefix + sslKeyFile, 'utf-8'),
  cert: fs.readFileSync(sslPrefix + sslCertFile, 'utf-8'),
  ca: fs.readFileSync(sslPrefix + sslCaFile, 'utf-8'),
  passphrase: fs.readFileSync(sslPrefix + 'passphrase.txt', 'utf-8').trim()
};

var jwtToken = fs.readFileSync(jwtTokenFile, 'utf-8').trim()

var server = http.createServer(app);
var secureServer = https.createServer(sslOptions, app);
var io = require('socket.io')(server);
var secureIo = require('socket.io')(secureServer);

app.use(helmet());
app.use(morgan('combined'));
app.use(express.static('dist'));

var verifyClient = function(wsUrl, jwtSecret) {
  var parsed, decoded;

  parsed = url.parse(wsUrl, true);
  if (!parsed.query.token) {
    debug('Missing token: ' + wsUrl);
    return false;
  }

  try {
    decoded = jwt.decode(parsed.query.token, jwtSecret);
  } catch (e) {
    debug('jwt decode error: ' + e.stack);
    return false;
  }

  return decoded;
};

var socketIoUse = function(socket, next){
  try {
    socket.token = verifyClient(socket.request.url, jwtToken);
    if (!socket.token) {
      next(new Error('Authentication error'));
    }
  } catch (err) {
    console.log('error: ' + err);
  }
  return next();
};

var socketIoOnConnection = function(localIo, socket) {
  try {
    socket.join(socket.token.room);
    var objs = localIo.nsps['/'].adapter.rooms[socket.token.room];
    var roomSize = Object.keys(objs).length;

    socket.on('pouchrepl', function(data) {
      socket.broadcast.to(socket.token.room).emit('pouchrepl', data);
    });

    localIo.to(socket.token.room).emit('count', { count: roomSize });
  } catch (err) {
    console.log('error: ' + err);
  }
};

io.use(socketIoUse);
secureIo.use(socketIoUse);

io.on('connection', socketIoOnConnection.bind(this, io));
secureIo.on('connection', socketIoOnConnection.bind(this, secureIo));

server.listen(port, function(){
  console.log('Listening on *:' + port);
});

secureServer.listen(sslPort, function(){
  console.log('SSL Listening on *:' + sslPort);
});
