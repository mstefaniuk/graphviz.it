module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'app/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    bower: {
      app: {
        options: {
          layout: "byType",
          cleanBowerDir: true,
          bowerOptions: {
            production: true
          }
        }
      }
    },
    clean: {
      app: ["app/lib/*", "!app/lib/viz.js", "app/js/parser"],
      bower: ["lib"]
    },
    connect: {
      server: {
        options: {
          base: "."
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.task.registerTask('pouchdb', 'Start of PouchDB.', function() {
    var spawnPouchdbServer = require('spawn-pouchdb-server');

    spawnPouchdbServer(function (error) {
      console.log('PouchDB Server stared at localhost:5985/_utils');
    })
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['build']);
  grunt.registerTask('start', ['pouchdb', 'connect:server:keepalive']);
  grunt.registerTask('build', ['clean:app', 'bower:app']);
};
