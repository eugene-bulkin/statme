Players = new Mongo.Collection('players'),
  PlayersIndex = new EasySearch.Index({
    collection: Players,
    fields: ['fullname'],
    engine: new EasySearch.Minimongo(),
    sort: function() {
    return {'score': -1};
    },
    defaultSearchOptions: {
    limit: 5
  },
  selector: function (searchObject, options, aggregation) {
      let selector = this.defaultConfiguration().selector(searchObject, options, aggregation)
      return selector;
      }
  });



Watched = new Mongo.Collection("watched");

WatchedSchema = new SimpleSchema({
  name: {
    type: String,
    label: "name"
  },
  isGame: {
    type: Boolean
  },
  isPlayer: {
    type: Boolean
  }
});

Watched.attachSchema(WatchedSchema);
