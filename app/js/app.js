require(["renderer", 'dot-checker', "ace/ace", "ace/lib/lang", "ace/ext/statusbar"],
  function (renderer, pegace, ace, lang, statusbar) {

    var editor = ace.edit("editor");
    var bar = document.getElementById('editor-bar');
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/dot");
    //var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
    //new StatusBar(editor, document.getElementById('editor-bar'));

    renderer.init("#graph");
    renderer.render(editor.getValue());
    renderer.errorHandler(function(error) {
      bar.textContent = error;
    });

    var messages = {
      syntax: "Syntax error near",
      keyword: "Unknown keyword",
      attribute: "Unknown attribute",
      unterminated: "Unterminated structure starting"
    };

    var update = lang.delayedCall(function () {
      var result = pegace.lint(editor.getValue());
      if (true) { // TODO improve dot source checking
        renderer.render(editor.getValue());
        bar.textContent = "";
        editor.getSession().clearAnnotations();
      } else {
        var annotations = result.errors.map(function (e) {
          var c = editor.getSession().getDocument().indexToPosition(e.pos);
          c.text = [messages[e.type], " '", e.string, "'."].join('');
          c.type = "error";
          return c;
        });
        editor.getSession().setAnnotations(annotations);
      }
    });
    editor.on("change", function () {
      update.delay(600);
    });
  }
);
