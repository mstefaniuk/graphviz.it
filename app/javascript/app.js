require(["editor", "jquery", "database", "renderer", "grapnel", "analytics", "gallery", "bootstrap"],
  function (editor, $, db, renderer, Grapnel, ga, gallery) {

    var bar = $('#editor-bar');

    renderer.init("#graph");
    renderer.errorHandler(function(error) {
      bar.text(error);
    });

    editor.onChange(function(value) {
      renderer.render(value);
      bar.text("Ok.");
    });


    var middleware = {
      document: function(req, event, next) {
        req.document = document;
        next();
      },
      image: function(req, event, next) {
        var img = renderer.getImage();
        img.onload = function () {
          req.image = img.src;
          next();
        }
      }
    };

    var transitions = {
      new: "Save",
      home: "Save",
      fiddle: "Update",
      gallery: "Fork"
    };

    var document;

    gallery.resources.forEach(function(e) {
      $("#examples select")
        .append("<option>" + e + "</option>");
    });

    $("#savePNG").click(function(event) {
      var img = renderer.getImage();
      img.onload = function () {
        $("#download").attr("href", img.src);
        $("#download")[0].click();
      };
      event.preventDefault();
    });

    var router =  new Grapnel();
    router.add("/", function() {
      editor.contents("digraph G {\n  ex -> am -> ple\n}");
    }).add("/new", function() {
      editor.contents("digraph G {\n\t\n}");
    }).add("/save", editor.middleware.source, db.middleware.save, db.middleware.update, function(req) {
      router.navigate('/' + req.params.fiddle);
    }).add("/fork", middleware.document, editor.middleware.source, db.middleware.save, db.middleware.update, function(req) {
      router.navigate('/' + req.params.fiddle);
    }).add("/update", middleware.document, editor.middleware.source, db.middleware.extract, db.middleware.update, middleware.image, db.middleware.image,
      function(req) {
        router.navigate("/" + [req.params.fiddle, req.params.attachment].join('/'));
    }).add("/gallery", function() {
      router.navigate('/gallery/' + gallery.random());
    }).add("/gallery/:gallery", gallery.middleware.load, function(req) {
      document = req.document;
      editor.contents(req.source);
      $('#examples select').val(req.params.gallery);
    }).add("/:fiddle([a-zA-Z]{8})/:attachment?", db.middleware.load, db.middleware.source, function(req) {
      document = req.document;
      editor.contents(req.source);
    }).add("*", function(req, e) {
      if(!e.parent()) {
        router.navigate('/gallery');
      } else {
        var clazz = e.previousState.req.keys.length>0 ? e.previousState.req.keys[0].name : e.previousState.route.replace('/','');
        clazz = clazz || 'home';
        $('body').removeClass().addClass(clazz);
        var state = transitions[clazz];
        if (state!=undefined) {
          $('#button span').text(state + " diagram").attr("href", "#/" + state.toLowerCase());
        }
        ga('send', 'pageview', e.value);
        e.stopPropagation();
      }
    });

    $('#examples select').on('keydown change', function() {
      var example = this.value;
      setTimeout(function() {
        router.navigate("/gallery/" + example);
      }, 50);
    });
  }
);
