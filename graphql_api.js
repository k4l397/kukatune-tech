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
