// ---------- GRAPHQL ---------- //
module.exports = function(app, db) {
  const graphql = require('graphql');
  const express_graphql = require('express-graphql');

  const graphql_house_type = new graphql.GraphQLObjectType({
    name: 'House',
    description: 'A GoT house',
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

  const graphql_region_type = new graphql.GraphQLObjectType({
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

  const graphql_character_type = new graphql.GraphQLObjectType({
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

  const graphql_schema = new graphql.GraphQLSchema({
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

  const graphql_root = {
    characters: ({id, first_name, last_name, status, titles, house}) => {
      let characters = db.find_characters(id, first_name, last_name, status, titles, house);

      for(let i = 0; i < characters.length; i++) {
        characters[i].house_id = characters[i].house;
        characters[i].house = () => {return graphql_root.houses({id: characters[i].house_id})[0]};
      }

      return characters;
    },
    regions: ({id, name, house}) => {
      let regions = db.find_regions(id, name, house);

      for (let i = 0; i < regions.length; i++) {
        regions[i].house_id = regions[i].house;
        regions[i].house = () => {return graphql_root.houses({id: regions[i].house_id})[0]};
      }

      return regions;
    },
    houses: ({id, name}) => {
      let houses = db.find_houses(id, name);

      for (let i = 0; i < houses.length; i++) {
        houses[i].regions = () => {return graphql_root.regions({house: houses[i].id})};
        houses[i].characters = () => {return graphql_root.characters({house: houses[i].id})};
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
}
