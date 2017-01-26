// ---------- PREAMBLE ---------- //

var express = require('express');

var app = express();

// ---------- DATABASE ---------- //

var db = require('./database.json');
console.log(db);

function db_find_characters(name, surname, rank, status) {
  var characters = [];
  for (var i = 0; i < db.characters.length; i++) {
    var valid = true;

    if (name !== undefined && name !== db.characters[i].name) valid = false;
    if (surname !== undefined && surname !== db.characters[i].surname) valid = false;
    if (rank !== undefined && rank !== db.ranks[db.characters[i].rank].name) valid = false;
    if (status !== undefined && status !== db.status[db.characters[i].status].name) valid = false;

    if (valid) {
      characters.push({
        name: db.characters[i].name,
        surname: db.characters[i].surname,
        rank: db_find_rank(db.characters[i].rank),
        status: db_find_status(db.characters[i].status)
      });
    }
  }
  return characters;
}

function db_find_rank(id) {
  return db.ranks[id].name;
}

function db_find_status(id) {
  return db.status[id].name;
}

// ---------- GRAPHQL ---------- //

var graphql = require('graphql');
var express_graphql = require('express-graphql');

var graphql_character_type = new graphql.GraphQLObjectType({
  name: 'Character',
  description: 'A character from Catch 22',
  fields: () => ({
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    surname: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    rank: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    status: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  })
});

var graphql_schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      characters: {
        type: new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql_character_type)),
        args: {
          name: {type: graphql.GraphQLString},
          surname: {type: graphql.GraphQLString},
          rank: {type: graphql.GraphQLString},
          status: {type: graphql.GraphQLString}
        }
      },
      rank: {
        type: graphql.GraphQLString,
        args: {
          id: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)}
        }
      },
      status: {
        type: graphql.GraphQLString,
        args: {
          id: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)}
        }
      }
    }
  }),
});

var graphql_root = {
  characters: ({name, surname, rank, status}) => {
    return db_find_characters(name, surname, rank, status);
  },
  rank: ({id}) => {
    return db_find_rank(id);
  },
  status: ({id}) => {
    return db_find_status(id);
  }
};

app.use('/graphql', express_graphql({
  schema: graphql_schema,
  rootValue: graphql_root,
  graphiql: true,
  pretty: true
}));

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

// ---------- SERVER ---------- //
app.listen(8080);
console.log("started on port 8080");
module.exports = app;
