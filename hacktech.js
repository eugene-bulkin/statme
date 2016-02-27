

if (Meteor.isClient) {
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
    apiCallHelper : function() {
      Meteor.call('getFromAPI', function(error, result) {
        if (error) {
          console.log(error.reason);
          return;
        }
        else if (result == false){
          return Session.get("isApiCallWorking");
        }
        else {
          Session.set("isApiCallWorking", true);
          console.log(Session.get("isApiCallWorking"));
          return Session.get("isApiCallWorking");
        }
      });
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // set up search bar

      ACCESS_TOKEN = JSON.parse(Assets.getText('api.json')).access_token;
      console.log(ACCESS_TOKEN);
  });
  Meteor.methods ({
    'getFromAPI' : function (){
      // api.access_token is YOUR access token for the stattleship api
      //
      HEADERS = {"Content-Type": "application/json", 
      "Accept": "application/vnd.stattleship.com; version=1",
      "Authorization": "Token token=" + ACCESS_TOKEN};
      this.unblock();
      try {
        var result = HTTP.call("GET", "https://www.stattleship.com/basketball/nba/game_logs?player_id=nba-stephen-curry", 
          {headers: HEADERS});
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }

  });
}
