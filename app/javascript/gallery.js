define(['jquery'], function($) {

  return {
    middleware: {
      load: function(req, event, next) {
        $.get("/gallery/" + req.params.gallery).done(function(diagram) {
          req.source = diagram;
          req.document = {
            type: "fiddle",
            fork: "gallery/" + req.params.gallery
          };
          next();
        });
      }
    },
    random: function() {
      return "abstract.gv";
    }
  }
});