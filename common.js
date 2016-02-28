
Players = new Mongo.Collection('players')



PlayersSchema = new SimpleSchema({
	full_name: {
		type: String
	},
	player_id: {
		type: Number
	}
});

Players.attachSchema(PlayersSchema);