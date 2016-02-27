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
