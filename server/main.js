var BASE_URL = "http://api.thescore.com";

var curTime = 1456620103;
var gameId = "nba-2015-2016-min-no-2016-02-27-1800";
var timer;
var watchedGames = {};

var clientWatch = function(data, socket) {
  watchedGames[gameId] = [{
    socket: socket,
    watching: data
  }];
}


Meteor.methods ({
  'update': function() {
    var result = Meteor.call('getPlayerStats', "105567");
    for(var k in watchedGames) {
      watchedGames[k].forEach(function(watchData) {
        var player = result.filter(function(playerLineScore) {
          return playerLineScore.player.id === watchData.watching.player;
        })[0];
        // console.log(player.updated_at);
        // console.log(player);
        if(player) {
          Streamy.emit("stats", player, watchData.socket);
        }
      });
    }
  },
  'getPlayerStats' : function (gameId) {
    var url = BASE_URL + "/nba/events/" + gameId;
    this.unblock();
    try {
      var game_event = HTTP.call("GET", url);
      var api_url = BASE_URL + game_event.data.box_score.api_uri + "/player_records?" + (new Date().getTime());
      var bs = HTTP.call("GET", api_url);
      return bs.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
});

Meteor.startup(function () {
    var schedule = JSON.parse(Assets.getText('data/schedule.json'));
    var today = moment().format('YYYY-MM-DD');
    var todayGames = schedule.current_season.filter(function(day) {
      return day.id == today;
    })[0].event_ids;

    timer = Meteor.setInterval(function() {
      Meteor.call("update");
    }, 2500);

    Streamy.on("watch", clientWatch);
});

