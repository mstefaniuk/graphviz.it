define(['jquery'], function($) {
  var resources = [
    "clust.gv",
    "clust1.gv",
    "clust2.gv",
    "clust3.gv",
    "clust4.gv",
    "clust5.gv"
  ];

  return {
    middleware: {
      load: function(req, event, next) {
        $.get("/gallery/" + req.params.diagram).done(function(diagram) {
          req.source = diagram;
          next();
        });
      }
    },
    random: function() {
      return resources[Math.floor(Math.random() * resources.length)];
    }
  }
});