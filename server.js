// ---------- SERVER ---------- //

var express = require('express');

var app = express();

require('./database.js');
require('./graphql_api.js');
require('./restful_api.js');

app.listen(8080);
console.log("started on port 8080");
module.exports = app;
