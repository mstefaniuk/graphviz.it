require(["editor", "jquery", "database", "renderer", "grapnel", "analytics", "gallery", "bootstrap"],
  function (editor, $, db, renderer, Grapnel, ga, gallery) {

    var bar = $('#editor-bar');

    renderer.init("#graph");
    renderer.errorHandler(function (error) {
      bar.text(error);
    });

    editor.onChange(function (value) {
      renderer.render(value);
      bar.text("Ok.");
    });

    var transitions = {
      new: "Save",
      home: "Save",
      fiddle: "Update",
      gallery: "Fork"
    };

    var middleware = {
      image: function (req, event, next) {
        var img = renderer.stage.getImage(false);
        img.onload = function () {
          req.image = img.src;
          next();
        }
      }
    };

    gallery.resources.forEach(function (e) {
      $("#examples select")
        .append("<option>" + e + "</option>");
    });

    $("#savePNGonDisk a").click(function (event) {
      var img = renderer.stage.getImage(false);
      img.onload = function () {
        $("#download").attr("href", img.src);
        $("#download")[0].click();
      };
      ga('send', 'event', 'Diagram', 'disk save', 'png');
      event.preventDefault();
    });

    var router = new Grapnel();
    router.add("/", function () {
      editor.contents("digraph G {\n  ex -> am -> ple\n}");
    }).add("/new", function () {
      editor.contents("digraph G {\n\t\n}");
    }).add("/save", middleware.image, editor.middleware.source, db.middleware.save, db.middleware.update, db.middleware.image, function (req) {
      router.navigate('/' + req.params.fiddle);
    }).add("/fork", editor.middleware.source, db.middleware.save, db.middleware.update, function (req) {
      router.navigate('/' + req.params.fiddle);
    }).add("/update", middleware.image, editor.middleware.source, db.middleware.update, db.middleware.image, function (req) {
      router.navigate("/" + [req.params.fiddle, req.params.attachment].join('/'));
    }).add("/gallery", function () {
      router.navigate('/gallery/' + gallery.random());
    }).add("/gallery/:gallery", gallery.middleware.load, function (req) {
      document = req.document;
      editor.contents(req.source);
      $('#examples select').val(req.params.gallery);
    }).add("/:fiddle([a-zA-Z]{8})/:attachment?", db.middleware.load, db.middleware.source, function (req) {
      document = req.document;
      editor.contents(req.source);
    }).add("*", function (req, e) {
      if (!e.parent()) {
        router.navigate('/gallery');
      } else {
        var clazz = e.previousState.req.keys.length > 0 ? e.previousState.req.keys[0].name : e.previousState.route.replace('/', '');
        clazz = clazz || 'home';
        $('body').removeClass().addClass(clazz);
        var state = transitions[clazz];
        if (state != undefined) {
          $('#button').attr("href", "#/" + state.toLowerCase());
          $('#button span').text(state + " diagram");
        }
        ga('send', 'pageview', e.value);
        e.stopPropagation();
      }
    });

    $('#examples select').on('keydown change', function () {
      var example = this.value;
      setTimeout(function () {
        router.navigate("/gallery/" + example);
      }, 50);
    });
  }
)
;
