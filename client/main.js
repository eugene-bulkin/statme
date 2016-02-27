Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg'))) {
      super_meteor_debug(error, info);
    }
  };
})(Meteor._debug);

var data;
var dataDep = new Tracker.Dependency();

Template.stats.helpers ({
  gameLog: function() {
    dataDep.depend();
    return data;
  }
});

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
