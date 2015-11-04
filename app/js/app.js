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


    var middleware = {
      document: function(req, event, next) {
        req.document = document;
        next();
      }
    };

    var document;

    var router =  new Grapnel();

    router.add("/fiddle", function() {
      editor.contents("digraph example {}");
      $("#save").text("Save diagram").attr("href", "#/fiddle/save");
    }).add("/fiddle/save", editor.middleware.source, db.middleware.save, db.middleware.update, function(req) {
      router.navigate('/fiddle/' + req.params.fiddle);
    }).add("/fiddle/update/:fiddle([a-zA-Z]{8})", middleware.document, editor.middleware.source, db.middleware.extract, db.middleware.update, function(req) {
      router.navigate("/fiddle/" + [req.params.fiddle, req.params.attachment].join('/'));
    }).add("/fiddle/:fiddle([a-zA-Z]{8})/:attachment?", db.middleware.load, db.middleware.source, function(req) {
      document = req.document;
      editor.contents(req.source);
      $("#save").text("Update diagram").attr("href", "#/fiddle/update/"+req.params.fiddle);
    }).add("/*", function(req, e) {
      if(!e.parent()) {
        router.navigate('/fiddle');
      }
    });

    router.on("navigate", function(stack, req) {
      console.log("Matched!");
    });
  }
);
