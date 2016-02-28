var fs = Npm.require("fs");

var BASE_URL = "http://api.thescore.com";

var startTime = 1456628315;
var curTime = startTime;
var endTime = 1456636040;
var timer;
var watchedGames = {};
var playerToGame = {};
var gameTimes = {};

var clientWatch = function(data, socket) {
  if(!playerToGame[data.player_id]) {
    return;
  }
  var gameId = playerToGame[data.player_id].gameId;
  if(!watchedGames[gameId]) {
    watchedGames[gameId] = [];
  }
  watchedGames[gameId].push({
    socket: socket,
    watching: data
  });
}

var clientUnwatch = function(data, socket) {
  if(!playerToGame[data.player_id]) {
    return;
  }
  var gameId = playerToGame[data.player_id].gameId;
  if(!watchedGames[gameId]) {
    return;
  }
  watchedGames[gameId] = watchedGames[gameId].filter(function(w) {
    return w.watching.player_id !== data.player_id;
  });
}

function getAssetPath() {
    var meteor_root = Npm.require('fs').realpathSync(process.cwd() + '/../');

    var application_root = Npm.require('fs').realpathSync(meteor_root + '/../');
    // if running on dev mode
    if (Npm.require('path').basename(Npm.require('fs').realpathSync(meteor_root + '/../../../')) == '.meteor') {
        application_root = Npm.require('fs').realpathSync(meteor_root + '/../../../../');
    }

    var assets_folder = meteor_root + '/server/assets/app';
    return assets_folder;
}

Meteor.publish("players", function(){
  return Players.find({});
});

Meteor.methods ({
  'update': function() {
    for(var gameId in watchedGames) {
      var prevTimes = gameTimes[gameId].filter(function(time) {
        return time < curTime;
      });
      if(prevTimes.length == 0) {
        continue;
      }
      var mostRecent = JSON.parse(Assets.getText('data/' + gameId + '/' + prevTimes[prevTimes.length - 1] + '.json'));
      watchedGames[gameId].forEach(function(watcher) {
        var player = mostRecent.filter(function(playerLineScore) {
          return playerLineScore.player.id === watcher.watching.player_id;
        })[0];
        if(player) {
          Streamy.emit("stats", player, watcher.socket);
        }
      });
    }
  },
  'getPlayerStats' : function (gameId) {
    return;
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
  },
  'getPlayersList' : function () {
    try {
      Players.remove({}); // don't forget to clear collection!
      for (var p in playerToGame){
        var fullName = playerToGame[p].fullName;
        var gameId = playerToGame[p].gameId;
        Players.insert({full_name: fullName, player_id: Number(p)});
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }
});

Meteor.startup(function () {
    var schedule = JSON.parse(Assets.getText('data/schedule.json'));
    //var today = moment().format('YYYY-MM-DD');
    var today = "2016-02-27";
    var todayGames = schedule.current_season.filter(function(day) {
      return day.id == today;
    })[0].event_ids;

    todayGames.forEach(function(gameId) {
      var path = getAssetPath() + "/data/" + gameId;
      if(Npm.require('fs').existsSync(path, fs.F_OK)) {
        var files = Npm.require('fs').readdirSync(path);
        gameTimes[gameId] = files.filter(function(file) {
          return file.indexOf(".json") > -1;
        }).map(function(file) {
          return parseInt(file.replace(/\.json$/,''), 10);
        });
        var players = JSON.parse(Assets.getText('data/' + gameId + '/' + files[files.length - 1]));
        players.forEach(function(player) {
          playerToGame[player.player.id] = {
            gameId: gameId,
            fullName: player.player.full_name
          };
        });
      }
    });
    Meteor.call("getPlayersList");

    console.log("Players loaded.");
    timer = Meteor.setInterval(function() {
      Meteor.call("update");
    }, 1000);

    tickTimer = Meteor.setInterval(function() {
      curTime += 1;
      if(curTime > endTime) {
        curTime = endTime;
      }
    }, 250);

    Streamy.on("watch", clientWatch);
    Streamy.on("unwatch", clientUnwatch);
});

