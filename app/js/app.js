require(["editor", "jquery", "database", "renderer", "grapnel"],
  function (editor, $, db, renderer, Grapnel) {

    var window = this;

    var bar = $('#editor-bar');

    renderer.init("#graph");
    renderer.errorHandler(function(error) {
      bar.text(error);
    });

    editor.onChange(function(value) {
      renderer.render(value);
      bar.text("");
    });

    var document;

    var router =  new Grapnel();

    router.add("/fiddle", function() {
      editor.contents("digraph example {}");
    }).add("/fiddle/save", editor.middleware.source, db.middleware.save, db.middleware.update, function(req) {
      router.navigate('/fiddle/' + req.params.fiddle);
    }).add("/fiddle/:fiddle/:attachment?", db.middleware.load, db.middleware.source, function(req) {
      document = req.document;
      editor.contents(req.source);
    }).add("fiddle/:fiddle/update", editor.middleware.source, db.middleware.update, function(req) {
      router.navigate("/fiddle/" + [req.params.fiddle, req.params.attachment].join('/'));
    }).add("/*", function(req, e) {
      if(!e.parent()) {
        router.navigate('/fiddle');
      }
    });

    router.on("match", function(stack, req) {
      console.log("Matched!");
    });
  }
);
