require.config({
  baseUrl: "javascript",
  paths: {
    d3: '../vendor/d3/d3',
    ace: '../vendor/ace',
    "dot-checker": '../vendor/graphviz-d3-renderer/dot-checker',
    "renderer": '../vendor/graphviz-d3-renderer/renderer',
    "layout-worker": '../vendor/graphviz-d3-renderer/layout-worker',
    worker: '../vendor/requirejs-web-workers/worker',
    pouchdb: '../vendor/pouchdb/pouchdb',
    jquery: '../vendor/jquery/jquery',
    bootstrap: '../vendor/bootstrap/bootstrap',
    "grapnel": '../vendor/grapnel/grapnel.min',
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
