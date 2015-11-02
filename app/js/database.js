define(['pouchdb', 'config'], function(PouchDB, config) {

  var db = new PouchDB(config.db.public);

  return {
    save: function(req, event, next) {
      var document = {
        type: "fiddle"
      };
      db.put(document, generateShurl(8))
        .then(function (result) {
          req.params.fiddle = result.id;
          req.revision = result.rev;
          req.params.attachment = "0";
          next();
        });
    },
    update: function(req, event, next) {
      var attachment = new Blob([req.source], {type: 'text/plain'});
      db.putAttachment(req.params.fiddle, req.params.attachment + '.gv', req.revision, attachment, 'text/plain')
        .then(function () {
          next();
        });
    },
    load: function(req, event, next) {
      db.get(req.params.fiddle).then(function(document) {
        req.document = document;
        if (!req.params.attachment) {
          req.params.attachment = "" + determineCurrentAttachment(document._attachments);
        }
        next();
      });
    },
    source: function(req, event, next) {
      db.getAttachment(req.document._id, req.params.attachment).then(function (blob) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
          req.source = this.result;
          next();
        });
        reader.readAsText(blob);
      });
    }
  };

  function determineCurrentAttachment(attachments) {
    var max = 0, current;
    for (var attachment in attachments) {
      current = Number.parse(attachment.split(".")[0]);
      max = current > max ? current : max;
    }
  }

  function generateShurl(length) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var shurl = '';
    for (var i=0; i<length; i++) {
      shurl += tab.charAt(Math.floor(Math.random() * tab.length));
    }
    return shurl;
  }
});