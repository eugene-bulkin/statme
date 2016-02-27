var BASE_URL = "https://www.stattleship.com/";

var curTime = 1456604373;
var gameId = "45ff34db-72c7-43ee-9136-da2b260237af";
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
    while(true) {
      try {
        Assets.getText("data/" + gameId + "/" + curTime + ".json");
        break;
      } catch(e) {
        curTime++;
      }
    }
    var result = JSON.parse(Assets.getText("data/" + gameId + "/" + curTime + ".json"));
    curTime += 7;
    for(var k in watchedGames) {
      watchedGames[k].forEach(function(watchData) {
        var r = result.game_logs.filter(function(log) {
          return log.player_id == watchData.watching.player;
        })[0];
        Streamy.emit("stats", r, watchData.socket);
      });
    }
  },
  'getGameLog' : function (playerId) {
    var sport = "basketball";
    var league = "nba";
    var action = "game_logs";
    var url = BASE_URL + "/" + sport + "/" + league + "/" + action;
    this.unblock();
    try {
      var result = HTTP.call("GET",
                             url + "?status=in_progress&player_id=" + playerId,
                             {headers: HEADERS});
      return result.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
});

Meteor.startup(function () {
    // code to run on server at startup
    // set up search bar
    var ACCESS_TOKEN = JSON.parse(Assets.getText('api.json')).access_token;
    HEADERS = {
      "Content-Type": "application/json",
      "Accept": "application/vnd.stattleship.com; version=1",
      "Authorization": "Token token=" + ACCESS_TOKEN
    };

    timer = Meteor.setInterval(function() {
      Meteor.call("update");
    }, 500);

    Streamy.on("watch", clientWatch);
});

