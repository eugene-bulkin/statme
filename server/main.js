var BASE_URL = "https://www.stattleship.com/";

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
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
});
