require(["editor", "jquery", "pouchdb", "renderer"],
  function (editor, $, PouchDB, renderer) {

    var bar = $('editor-bar');

    renderer.init("#graph");
    renderer.errorHandler(function(error) {
      bar.text(error);
    });

    editor.onChange(function(value) {
      renderer.render(value);
      bar.text("");
    });
  }
);
