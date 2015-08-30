var express = require('express');
var app = express();
var http = require('http').Server(app);
var morgan = require('morgan');
var io = require('socket.io')(http);

var url = require('url');
var debug = require('debug')('shuttle-server');
var jwt = require('jwt-simple');

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
  socket.token = verifyClient(socket.request.url, 'nosecret');
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

http.listen(3000, function(){
  console.log('Listening on *:3000');
});
