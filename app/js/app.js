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
      editor.contents("");
    }).add("/fiddle/save", db.save, db.update, function(req) {
      router.navigate('/fiddle/' + req.params.fiddle);
    }).add("/fiddle/:fiddle/:attachment?", db.load, db.source, function(req) {
      document = req.document;
      editor.contents(req.source);
    }).add("fiddle/:fiddle/");
  }
);
