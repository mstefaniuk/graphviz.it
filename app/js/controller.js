define(['jquery', 'pouchdb'], function($, PouchDB) {
  var db = new PouchDB('http://localhost:5984/public');

  function generateShurl(length) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var shurl = '';
    for (var i=0; i<length; i++) {
      shurl += tab.charAt(Math.floor(Math.random() * tab.length));
    }
    return shurl;
  }

  db.put({
      title: "example"
    }, generateShurl(8)
  ).then(function(result){
      console.log(result.id);
      console.log(btoa(result.id))
  });

});