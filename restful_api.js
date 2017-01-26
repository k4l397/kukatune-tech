// ---------- RESTFUL ---------- //

app.get('/restful/characters/', function (req, res) {
  res.end(JSON.stringify(db_find_characters(req.query.name, req.query.surname, req.query.rank, req.query.status)));
});

app.get('/restful/rank/', function (req, res) {
  res.end(JSON.stringify(db_find_rank(req.query.id)));
});

app.get('/restful/status/', function (req, res) {
  res.end(JSON.stringify(db_find_status(req.query.id)));
});
