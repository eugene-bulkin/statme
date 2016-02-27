var data;
var dataDep = new Tracker.Dependency();

Meteor.call('getFromAPI', "nba-dwyane-wade", function(error, result) {
  if (error) {
    console.log(error.reason);
    return;
  }
  var gameLog = result.data.game_logs[0];
  data = gameLog;
  dataDep.changed();
});

// jsonStuff is a session variable to test if we can set and get session data from the server to the client
Session.set("jsonStuff", "this is some stuff");

// counter starts at 0
Template.jsonStuff.helpers ({
  jsonStuffHelper : function(){
    return Session.get("jsonStuff");
  }
});

Template.apiCallTest.helpers({
  gameLog: function() {
    dataDep.depend();
    return data;
  }
});
