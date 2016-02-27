var BASE_URL = "https://www.stattleship.com/";

if (Meteor.isClient) {
  var data;
  Meteor.call('getFromAPI', "nba-dwyane-wade", function(error, result) {
    if (error) {
      console.log(error.reason);
      return;
    }
    var gameLog = result.data.game_logs[0];
    Session.set("data", gameLog);
  });
  // jsonStuff is a session variable to test if we can set and get session data from the server to the client
  Session.set("jsonStuff", "this is some stuff");
  Session.set("isApiCallWorking", false);
  // counter starts at 0
  Template.jsonStuff.helpers ({
    jsonStuffHelper : function(){
      return Session.get("jsonStuff");
    }
  });
  Template.apiCallTest.helpers ({
    gameLog : function() {
      return Session.get("data");
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // set up search bar
      var ACCESS_TOKEN = JSON.parse(Assets.getText('api.json')).access_token;
      HEADERS = {
        "Content-Type": "application/json",
        "Accept": "application/vnd.stattleship.com; version=1",
        "Authorization": "Token token=" + ACCESS_TOKEN
      };
  });
  Meteor.methods ({
    'getFromAPI' : function (playerId) {
      var sport = "basketball";
      var league = "nba";
      var action = "game_logs";
      var url = BASE_URL + "/" + sport + "/" + league + "/" + action;
      this.unblock();
      try {
        var result = HTTP.call("GET",
                               url + "?status=in_progress&player_id=" + playerId,
                               {headers: HEADERS});
        return result;
      } catch (e) {
        console.log(e);
        return null;
      }
    }

  });
}
