Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg'))) {
      super_meteor_debug(error, info);
    }
  };
})(Meteor._debug);

var data;
var dataDep = new Tracker.Dependency();

Session.setDefault("watched", []);

Meteor.subscribe("players");


Template.search_bar_results.events ({
 	"change .player-select": function (event) {

      var toWatch = {player_id: this.player_id};
      watched = Session.get("watched");
      if(event.target.checked) {
        watched.push(toWatch);
        Streamy.emit("watch", toWatch);
      } else {
        watched = watched.filter(function(w) { return w.player_id !== toWatch.player_id });
        Streamy.emit("unwatch", toWatch);
      }
      Session.set("watched", watched);
    }
});

Template.search_bar_results.helpers ({
    list_of_players: function(){
    	return Players.find({});
  	}
  });



Template.stats.helpers ({
  gameLog: function() {
    dataDep.depend();
    if(!data) {
      return null;
    }
    if (data.player.id == this.player_id) {
      return data;
    }
  }
});

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });

Template.body.helpers ({
  watched: function() {
    return Session.get("watched");
  },
  playersList: function() {
    return [];
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Streamy.onConnect(function() {
  Session.get("watched").forEach(function(toWatch) {
    Streamy.emit("watch", {
      player: toWatch.player_id
    });
  });
});

Streamy.on("stats", function(d) {
  data = d;
  dataDep.changed();
});
