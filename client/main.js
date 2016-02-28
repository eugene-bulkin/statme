Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg'))) {
      super_meteor_debug(error, info);
    }
  };
})(Meteor._debug);

var data;
var dataDep = new Tracker.Dependency();

Session.setDefault("watched", [{ player_id: 24498 }]);

Meteor.subscribe("players");


Template.stats.helpers ({
  gameLog: function() {
    dataDep.depend();
    if(!data) {
      return null;
    }
    if (data.player.id == this.player_id) {
      return data;
    }
  },
  logo: function(player) {
    return player.teams[0].logos.small;
  },
  pcts: function() {
    dataDep.depend();
    if(!data) {
      return null;
    }
    return {
      field_goals: (100 * (data.field_goals_made / data.field_goals_attempted)) | 0,
      three_point_field_goals: (100 * (data.three_point_field_goals_made / data.three_point_field_goals_attempted)) | 0,
      free_throws: (100 * (data.free_throws_made / data.free_throws_attempted)) | 0,
    };
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
  Streamy.emit("watch", {
    player: Session.get("watched")[0].player_id
  });
});

Streamy.on("stats", function(d) {
  data = d;
  dataDep.changed();
});
