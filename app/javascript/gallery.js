define(['jquery'], function($) {
  var resources = [
    "abstract.gv",
    "alf.gv",
    "arr_none.gv",
    "arrows.gv",
    "awilliams.gv",
    "biological.gv",
    "clust.gv",
    "clust1.gv",
    "clust2.gv",
    "clust3.gv",
    "clust4.gv",
    "clust5.gv",
    "crazy.gv",
    "ctext.gv",
    "dfa.gv",
    "fig6.gv",
    "fsm.gv",
    "grammar.gv",
    "hashtable.gv",
    "honda-tokoro.gv",
    "japanese.gv",
    "jcctree.gv",
    "jsort.gv",
    "KW91.gv",
    "Latin1.gv",
    "ldbxtried.gv",
    "longflat.gv",
    "mike.gv",
    "NaN.gv",
    "nhg.gv",
    "oldarrows.gv",
    "pgram.gv",
    "pm2way.gv",
    "pmpipe.gv",
    "polypoly.gv",
    "proc3d.gv",
    "psfonttest.gv",
    "record2.gv",
    "records.gv",
    "rowe.gv",
    "russian.gv",
    "sdh.gv",
    "shells.gv",
    "states.gv",
    "structs.gv",
    "switch.gv",
    "table.gv",
    "train11.gv",
    "trapeziumlr.gv",
    "tree.gv",
    "triedds.gv",
    "try.gv",
    "unix.gv",
    "unix2.gv",
    "viewfile.gv",
    "world.gv"
  ];

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
      return resources[Math.floor(Math.random() * resources.length)];
    }
  }
});