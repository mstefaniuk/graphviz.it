define(['pouchdb', 'config'], function (PouchDB, config) {

  var db = new PouchDB(config.db.public);

  var currentDocument;

  return {
    savePNG: function(image) {
      var blob = dataURItoBlob(image);
      db.putAttachment(currentDocument._id, 'image.png', currentDocument._rev, blob, 'image/png');
    },
    middleware: {
      save: function (req, event, next) {
        var document = req.document || {
            type: "fiddle"
          };
        db.put(document, generateShurl(8))
          .then(function (result) {
            req.params.fiddle = result.id;
            currentDocument = {
              _rev: result.rev,
              _id: result.id
            };
            next();
          });
      },
      update: function (req, event, next) {
        var attachment = new Blob([req.source], {type: 'text/plain'});
        var count = currentAttachment(currentDocument._attachments);
        var name = "" + (count + 1);
        db.putAttachment(currentDocument._id, name + '.gv', currentDocument._rev, attachment, 'text/plain')
          .then(function (result) {
            currentDocument._rev = result.rev;
            req.params.fiddle = currentDocument._id;
            req.params.attachment = name;
            next();
          });
      },
      image: function (req, event, next) {
        var image = dataURItoBlob(req.image);
        db.putAttachment(req.params.fiddle, 'image.png', currentDocument._rev, image, 'image/png')
          .then(function () {
            next();
          });
      },
      load: function (req, event, next) {
        db.get(req.params.fiddle).then(function (document) {
          currentDocument = document;
          next();
        });
      },
      source: function (req, event, next) {
        req.params.attachment = req.params.attachment || "" + currentAttachment(currentDocument._attachments);
        db.getAttachment(currentDocument._id, req.params.attachment + '.gv').then(function (blob) {
          var reader = new FileReader();
          reader.addEventListener("loadend", function () {
            req.source = this.result;
            next();
          });
          reader.readAsText(blob);
        });
      }
    }
  };

  function currentAttachment(attachments) {
    var max = -1, current;
    for (var attachment in attachments) {
      current = parseInt(attachment.split(".")[0]);
      max = current > max ? current : max;
    }
    return max;
  }

  function generateShurl(length) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var shurl = '';
    for (var i = 0; i < length; i++) {
      shurl += tab.charAt(Math.floor(Math.random() * tab.length));
    }
    return shurl;
  }

  function dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }
});