require.config({
  baseUrl: "app/js",
  paths: {
    d3: '/lib/d3/d3',
    ace: '/lib/ace',
    "dot-checker": '/lib/graphviz-d3-renderer/dot-checker',
    "renderer": '/lib/graphviz-d3-renderer/renderer',
    "layout-worker": '/lib/graphviz-d3-renderer/layout-worker',
    worker: '/lib/requirejs-web-workers/worker',
    pouchdb: '/lib/pouchdb/pouchdb',
    jquery: '/lib/jquery/jquery',
    bootstrap: '/lib/bootstrap/bootstrap',
    "grapnel": '/lib/grapnel/grapnel.min',
    config: '../config'
  },
  shim: {
    jquery: {
      exports: "$"
    },
    bootstrap: {
      deps: ["jquery"],
      exports: "$.fn.popover"
    }
  },
  deps: ["app"]
});
