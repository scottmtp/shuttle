'use strict';
var fs = require('fs');
var uuid = require('uuid');

// START CONFIGURATION
var jwtTokenFile = process.env.JWT_TOKEN_FILE;
// END CONFIGURATION

var jwt = require('jwt-simple');
var payload = { user: process.argv[2], room: uuid.v4() };
var secret = fs.readFileSync(jwtTokenFile, 'utf-8').trim();

var token = jwt.encode(payload, secret);

console.log(JSON.stringify(payload));
console.log(token);
