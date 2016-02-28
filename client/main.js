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
    player: 148
  });
});

Streamy.on("stats", function(d) {
  console.log(d);
  data = d;
  dataDep.changed();
});
