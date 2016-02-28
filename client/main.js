Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg'))) {
      super_meteor_debug(error, info);
    }
  };
})(Meteor._debug);

var data;
var dataDep = new Tracker.Dependency();
Session.setDefault("watched", [{player_id: "148"}]);

Template.search.helpers({
  inputAttributes: function () {
      return { 'class': 'easy-search-input', 'placeholder': 'sum fuck?.' };
    },
  playersIndex: () => PlayersIndex
});


Template.stats.helpers ({
  gameLog: function() {
    dataDep.depend();
    // console.log(data.player.id);
    // console.log(this.player_id);
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
  }
});

  Template.player.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this.__originalId) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selectedPlayer", this.__originalId);
    }
  });

Tracker.autorun(function () {
  let cursor = PlayersIndex.search("").fetch();
  console.log(cursor);
  });

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

// Helper for the input bar: on selection, push the nba_player_name or nba_team_name to Session : "watched" array.
// Might need to use Tracker.autorun, but I don't think so.
// Need to find the game that's being watched that corresponds to the identifier of team or player in Session: "watch",
// which should be coming from Streamy somehow. Need to change 'data' in gameLog stats.helper to reflect this.


Streamy.onConnect(function() {
  Streamy.emit("watch", {
    player: 148
  });
});

Streamy.on("stats", function(d) {
  console.log(d);
  data = d;
  dataDep.changed();
});
