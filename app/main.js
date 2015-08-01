require.config({
  baseUrl: "app/js",
  paths: {
    d3: '/bower_components/d3/d3',
    ace: '/bower_components/ace/lib/ace',
    "dot-checker": '/bower_components/graphviz-d3-renderer/dist/dot-checker',
    "renderer": '/bower_components/graphviz-d3-renderer/dist/renderer',
    "viz": '/bower_components/graphviz-d3-renderer/dist/viz',
    "layout-worker": '/bower_components/graphviz-d3-renderer/dist/layout-worker',
    worker: '/bower_components/requirejs-web-workers/src/worker'
  },
  deps: ["app"]
});
