var data;
var dataDep = new Tracker.Dependency();

Meteor.call('getGameLog', "nba-dwyane-wade", function(error, result) {
  if (error) {
    console.log(error.reason);
    return;
  }
  var gameLog = result.data.game_logs[0];
  data = gameLog;
  dataDep.changed();
});

Template.stats.helpers ({
  gameLog: function() {
    dataDep.depend();
    return data;
  }
});
