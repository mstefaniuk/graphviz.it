var capabilities = [{
  browserName: 'chrome'
},{
  browserName: 'firefox'
}];

exports.config = {
  host: 'ondemand.saucelabs.com',
  port: 80,
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  updateJob: true,
  services: ['sauce'],

  specs: [
    'features/*.feature'
  ],

  capabilities: capabilities.map(function(e) {
    if (process.env.TRAVIS_JOB_NUMBER) {
      return {
        browserName: e.browserName,
        name: "Integration job",
        public: true,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER
      }
    } else {
      return {
        browserName: e.browserName,
        name: "Development launch",
        public: true
      }
    }
  }),

  logLevel: 'specs',
  coloredLogs: true,
  screenshotPath: 'shots',
  baseUrl: 'http://localhost:8000',
  waitforTimeout: 2000,
  framework: 'cucumber',
  reporter: 'xunit',
  reporterOptions: {
    outputDir: 'results'
  },
  cucumberOpts: {
    //require: ['features/step-definitions/welcome.js'],
    backtrace: false,   // <boolean> show full backtrace for errors
    compiler: [],       // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false,      // <boolean> invoke formatters without executing steps
    failFast: false,    // <boolean> abort the run on first failure
    format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    colors: true,       // <boolean> disable colors in formatter output
    snippets: true,     // <boolean> hide step definition snippets for pending steps
    source: true,       // <boolean> hide source uris
    profile: [],        // <string[]> (name) specify the profile to use
    strict: false,      // <boolean> fail if there are any undefined or pending steps
    tags: [],           // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    timeout: 30000,      // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false // <boolean> Enable this config to treat undefined definitions as warnings.
  }
};