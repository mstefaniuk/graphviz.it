define(['dot-checker', "ace/ace", "ace/lib/lang"],
  function (pegace, ace, lang) {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/dot");
    //var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
    //new StatusBar(editor, document.getElementById('editor-bar'));

    var messages = {
      syntax: "Syntax error near",
      keyword: "Unknown keyword",
      attribute: "Unknown attribute",
      unterminated: "Unterminated structure starting"
    };

    var callback;

    var update = lang.delayedCall(function () {
      var result = pegace.lint(editor.getValue());
      if (true) { // TODO improve dot source checking
        if (callback) {
          callback(editor.getValue());
        }
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

    return {
      onChange: function(fn) {
        callback = fn;
        callback(editor.getValue());
      },
      contents: function(contents) {
        if (contents!==undefined) {
          editor.setValue(contents);
        } else {
          return editor.getValue();
        }
      }
    }
  }
);