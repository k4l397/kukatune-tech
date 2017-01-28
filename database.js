// ---------- DATABASE ---------- //
const db = require('./database.json');

function find_houses(id, name) {
  let result = [];
  for (let i = 0; i < db.houses.length; i++) {
    db.houses[i].id = i;

    let valid = true;

    if (id !== undefined && i !== id) valid = false;

    if (name !== undefined && db.houses[i].name !== name) valid = false;

    if (valid) result.push(db.houses[i]);
  }
  return result;
}

function find_regions(id, name, house) {

  let result = [];
  for (let i = 0; i < db.regions.length; i++) {
    db.regions[i].id = i;

    let valid = true;

    if (id !== undefined && i !== id) valid = false;

    if (name !== undefined && name !== db.regions[i].name) valid = false;

    if (house !== undefined && house !== db.regions[i].house) valid = false;

    if (valid) result.push(db.regions[i]);
  }
  return result;
}

function find_characters(id, first_name, last_name, status, titles, house) {
  let result = [];

  for (let i = 0; i < db.characters.length; i++) {
    db.characters[i].id = i;

    let valid = true;

    if (id !== undefined && i !== id) valid = false;

    if (first_name !== undefined && first_name !== db.characters[i].first_name) valid = false;

    if (last_name !== undefined && last_name !== db.characters[i].last_name) valid = false;

    if (status !== undefined && status !== db.characters[i].status) valid = false;

    if (titles !== undefined) {
      let valid2 = false;

      for (let j = 0; j < db.characters[i].titles.length; j++) {

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

module.exports = {find_houses, find_regions, find_characters};
