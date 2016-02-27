var data;
Meteor.call('getGameLog', "nba-dwyane-wade", function(error, result) {
  if (error) {
    console.log(error.reason);
    return;
  }
  var gameLog = result.data.game_logs[0];
  Session.set("data", gameLog);
});

// jsonStuff is a session variable to test if we can set and get session data from the server to the client
Session.set("jsonStuff", "this is some stuff");

Template.plus_minus.helpers ({
  gameLog : function() {
    return Session.get("data");
  }
});
