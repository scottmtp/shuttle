'use strict';
var fs = require('fs');
var uuid = require('uuid');

// START CONFIGURATION
var sslPrefix = process.env.SSL_PREFIX || './keys/';
// END CONFIGURATION

var jwt = require('jwt-simple');
var payload = { user: process.argv[2], room: uuid.v4() };
var secret = fs.readFileSync(sslPrefix + 'passphrase.txt', 'utf-8').trim();

var token = jwt.encode(payload, secret);

console.log(JSON.stringify(payload));
console.log(token);
