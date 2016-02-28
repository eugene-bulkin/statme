Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg'))) {
      super_meteor_debug(error, info);
    }
  };
})(Meteor._debug);

var data;
var dataDep = new Tracker.Dependency();
Session.setDefault("watched", [{player_id: "c5101bd8-bb6b-4a9f-b949-6fc4f0a33c9e"}]);

Template.stats.helpers ({
  gameLog: function() {
    dataDep.depend();
    if (data.player_id == this.player_id) {
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
  }
})

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

// Helper for the input bar: on selection, push the nba_player_name or nba_team_name to Session : "watched" array.
// Might need to use Tracker.autorun, but I don't think so.
// Need to find the game that's being watched that corresponds to the identifier of team or player in Session: "watch",
// which should be coming from Streamy somehow. Need to change 'data' in gameLog stats.helper to reflect this.


Streamy.onConnect(function() {
  Streamy.emit("watch", {
    player: "c5101bd8-bb6b-4a9f-b949-6fc4f0a33c9e"
  });
});

Streamy.on("stats", function(d) {
  console.log(d);
  data = d;
  dataDep.changed();
});
