var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var morgan = require('morgan');

var url = require('url');
var debug = require('debug')('shuttle-server');
var jwt = require('jwt-simple');

// START CONFIGURATION
var port = process.env.PORT || 80;
var sslPort = process.env.SSL_PORT || 443;
var sslPrefix = process.env.SSL_PREFIX || './keys/';
// END CONFIGURATION

var forceSSL = require('express-force-ssl');
var fs = require('fs');

var sslOptions = {
  key: fs.readFileSync(sslPrefix + 'key.enc.pem', 'utf-8'),
  cert: fs.readFileSync(sslPrefix + 'cert.pem', 'utf-8'),
  ca: fs.readFileSync(sslPrefix + 'certchain.pem', 'utf-8'),
  passphrase: fs.readFileSync(sslPrefix + 'passphrase.txt', 'utf-8').trim()
};

var jwtToken = sslOptions.passphrase;

app.use(forceSSL);

var server = http.createServer(app);
var secureServer = https.createServer(sslOptions, app);
var io = require('socket.io')(secureServer);

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

io.use(function(socket, next){
  socket.token = verifyClient(socket.request.url, jwtToken);
  if (!socket.token) {
    next(new Error('Authentication error'));
  }

  return next();
});

io.on('connection', function(socket) {
  socket.join(socket.token.room);
  var objs = io.nsps['/'].adapter.rooms[socket.token.room];
  var roomSize = Object.keys(objs).length;

  socket.on('pouchrepl', function(data) {
    socket.broadcast.to(socket.token.room).emit('pouchrepl', data);
  });

  io.to(socket.token.room).emit('count', { count: roomSize });
});

server.listen(port, function(){
  console.log('Listening on *:' + port);
});

secureServer.listen(sslPort, function(){
  console.log('SSL Listening on *:' + sslPort);
});
