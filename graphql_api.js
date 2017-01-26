// ---------- GRAPHQL ---------- //

var graphql = require('graphql');
var express_graphql = require('express-graphql');

var graphql_house_type = new graphql.GraphQLObjectType({
  name: 'Region',
  description: 'A GoT region',
  fields: () => ({
    id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
    },
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    regions: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql_region_type))
    },
    characters: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql_character_type))
    }
  })
});

var graphql_region_type = new graphql.GraphQLObjectType({
  name: 'Region',
  description: 'A GoT region',
  fields: () => ({
    id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
    },
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    house: {
      type: graphql_house_type
    }
  })
});

var graphql_character_type = new graphql.GraphQLObjectType({
  name: 'Character',
  description: 'A major GoT character',
  fields: () => ({
    id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
    },
    first_name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    last_name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    status: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    titles: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql.GraphQLString))
    },
    house: {
      type: graphql_house_type
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
          id: {type: graphql.GraphQLInt},
          first_name: {type: graphql.GraphQLString},
          last_name: {type: graphql.GraphQLString},
          status: {type: graphql.GraphQLString},
          titles: {type: new graphql.GraphQLList(graphql.GraphQLString)},
          house: {type: graphql.GraphQLInt}
        }
      },
      regions: {
        type: new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql_region_type)),
        args: {
          id: {type: graphql.GraphQLInt},
          name: {type: graphql.GraphQLString},
          house: {type: graphql.GraphQLInt}
        }
      },
      houses: {
        type: new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql_house_type)),
        args: {
          id: {type: graphql.GraphQLInt},
          name: {type: graphql.GraphQLString}
        }
      }
    }
  }),
});

var graphql_root = {
  characters: ({id, first_name, last_name, status, titles, house}) => {
    var chars = db_find_characters(name, surname, rank, status);

    for (var i = 0; i < chars.length; i++) {
      // convert house id to house obj
    }

    return chars;
  },
  regions: ({id, name, house}) => {
    var regions = db_find_regions(id, name, house);

    for (var i = 0; i < chars.length; i++) {
      // convert house id to house object
    }

    return regions;
  },
  houses: ({id, name}) => {
    var houses = db_find_houses(id, name);

    for (var i = 0; i < houses.length; i++) {
      // add regions and characters in
    }

    return houses;
  }
};

app.use('/graphql', express_graphql({
  schema: graphql_schema,
  rootValue: graphql_root,
  graphiql: true,
  pretty: true
}));
