
Players = new Mongo.Collection('players'),
  PlayersIndex = new EasySearch.Index({
    collection: Players,
    fields: ['full_name'],
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



PlayersSchema = new SimpleSchema({
	full_name: {
		type: String
	},
	player_id: {
		type: Number
	}
});

Players.attachSchema(PlayersSchema);