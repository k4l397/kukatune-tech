// ---------- DATABASE ---------- //

var db = require('./database.json');

function db_find_houses(id, name, regions) {
  var result = [];
  for (var i = 0; i < db.houses.length; i++) {

    var valid = true;

    if (id !== undefined && i !== id) valid = false;

    if (name !== undefined && db.houses[i].name === name) valid = false

    if (regions !== undefined) {
      var valid2 = false;

      for (var j = 0; j < db.houses[i].regions.length; j++) {

        if (regions.some(function(element, index, array) {
          return element === db.houses[i].regions[j].name;
        })) valid2 = true;
      }

      if (!valid2) valid = false;
    }

    if (valid) result.push(db.houses[i]);
  }
  return result;
}

function db_find_regions(id) {
  var result = [];
  for (var i = 0; i < db.regions.length; i++) {
    var valid = true;

    if (id !== undefined && i !== id) valid = false;

    if (valid) result.push(db.regions[i]);
  }
  return result;
}

function db_find_character(id, first_name, last_name, status, titles, house) {
  var result = [];

  for (var i = 0; i < db.characters.length; i++) {
    var valid = true;

    if (id !== undefined && i !== id) valid = false;

    if (first_name !== undefined && first_name !== db.characters[i].first_name) valid = false;

    if (last_name !== undefined && last_name !== db.characters[i].last_name) valid = false;

    if (status !== undefined && status !== db.characters[i].status) valid = false;

    if (titles !== undefined) {
      var valid2 = false;

      for (var j = 0; j < db.characters[i].titles.length; j++) {

        if(titles.some(function(element, index, array) {
          return element == db.characters[i].titles[j];
        })) valid2 = true;
      }
      if (!valid2) valid = false;
    }

    if (house !== undefined && house !== db.characters[i].house) valid = false;

    if (valid) result.push(db.characters[i]);
  }

  return result;
}
