// ---------- PREAMBLE ---------- //

var express = require('express');

var app = express();

// ---------- DATABASE ---------- //

var db = {
  characters: [
    {
      name: 'John',
      surname: 'Yossarian',
      rank: 0,
      status: 0
    },
    {
      name: 'Albert',
      surname: 'Tappman',
      rank: 1,
      status: 0
    },
    {
      name: 'Chuck',
      surname: 'Cathcart',
      rank: 2,
      status: 0
    },
    {
      name: 'Milo',
      surname: 'Minderbinder',
      rank: 3,
      status: 0
    },
    {
      name: 'Edward',
      surname: 'Nately',
      rank: 3,
      status: 1
    },
    {
      name: 'Major',
      surname: 'Major',
      rank: 4,
      status: 0
    },
    {
      name: 'Unknown',
      surname: 'Aardvaark',
      rank: 1,
      status: 1
    },
    {
      name: 'Unknown',
      surname: 'McWatt',
      rank: 3,
      status: 1
    }
  ],
  ranks: [
    {
      name: 'Captain'
    },
    {
      name: 'Chaplain'
    },
    {
      name: 'Colonel'
    },
    {
      name: 'Lieutenant'
    },
    {
      name: 'Major'
    }
  ],
  status: [
    {
      name: 'Alive'
    },
    {
      name: 'Deceased'
    }
  ]
};

function db_find_characters(name, surname, rank, status) {
  var characters = [];
  for (var i = 0; i < db.characters.length; i++) {
    var valid = true;

    if (name !== undefined && name !== db.characters[i].name) valid = false;
    if (surname !== undefined && surname !== db.characters[i].surname) valid = false;
    if (rank !== undefined && rank !== db.ranks[db.characters[i].rank].name) valid = false;
    if (status !== undefined && status !== db.status[db.characters[i].status].name) valid = false;

    if (valid) {
      characters.push(db.characters[i]);
    }
  }
  return characters;
}

function db_find_rank(name) {
  for (var i = 0; i < db.ranks.length; i++) {
    if (db.ranks[i].name === name) {
      return db.ranks[i];
    }
  }
}

function db_find_status(name) {
  for (var i = 0; i < db.status.length; i++) {
    if (db.status[i].name === name) {
      return db.status[i];
    }
  }
}

// ---------- GRAPHQL ---------- //

var graphql = require('graphql');
var express_graphql = require('express-graphql');

var graphql_status_type = new graphql.GraphQLObjectType({
  name: 'Status',
  description: 'A character\'s status at the end of the book',
  fields: () => ({
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  })
});

var graphql_rank_type = new graphql.GraphQLObjectType({
  name: 'Rank',
  description: 'A character\'s military rank',
  fields: () => ({
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  })
});

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
      type: new graphql.GraphQLNonNull(graphql_rank_type)
    },
    status: {
      type: new graphql.GraphQLNonNull(graphql_status_type)
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
        type: graphql_rank_type,
        args: {
          name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
        }
      },
      status: {
        type: graphql_status_type,
        args: {
          name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
        }
      }
    }
  }),
});

var graphql_root = {
  characters: ({name, surname, rank, status}) => {
    return db_find_characters(name, surname, rank, status);
  },
  rank: ({name}) => {
    return db_find_rank(name);
  },
  status: ({name}) => {
    return db_find_status(name);
  }
};

app.use('/graphql', express_graphql({
  schema: graphql_schema,
  rootValue: graphql_root,
  graphiql: true,
  pretty: true
}));

// ---------- RESTFUL ---------- //

app.get(/\/restful\/characters\/(name\/[A-z]+\/)?(surname\/[A-z]+\/)?(rank\/[A-z]+\/)?(status\/[A-z]+\/)?/, function (req, res) {
  for (var i = 0; i < 4; i++) {
    if (req.params[i] !== undefined) {
      req.params[i] = /[a-z]+\/([A-z]+)\//.exec(req.params[i])[1];
    }
  }
  res.end(JSON.stringify(db_find_characters(req.params[0], req.params[1], req.params[2], req.params[3])));
});

app.get('/restful/rank/:name', function (req, res) {
  res.end(JSON.stringify(db_find_rank(req.params.name)));
});

app.get('/restful/status/:name', function (req, res) {
  res.end(JSON.stringify(db_find_status(req.params.name)));
});

// ---------- SERVER ---------- //
app.listen(8080);
console.log("started on port 8080");
module.exports = app;
