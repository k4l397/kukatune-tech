// ---------- SERVER ---------- //

const express = require('express');

const app = express();

const db = require('./database.js');

require('./graphql_api.js')(app, db);

require('./restful_api.js')(app, db);

app.listen(8080);
console.log("started on port 8080");
module.exports = app;
