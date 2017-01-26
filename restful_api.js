// ---------- RESTFUL ---------- //

app.get('/restful/characters/', function (req, res) {
  res.end(JSON.stringify(db_find_characters(req.query.id, req.query.first_name, req.query.last_name, req.query.status, req.query.titles, req.query.house)));
});

app.get('/restful/regions/', function (req, res) {
  res.end(JSON.stringify(db_find_regions(req.query.id, req.query.name req.query.house)));
});

app.get('/restful/houses/', function (req, res) {
  res.end(JSON.stringify(db_find_houses(req.query.id, req.query.name)));
});
