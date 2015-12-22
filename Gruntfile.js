module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bwr: grunt.file.readJSON('bower.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'app/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      dist: ["dist"]
    },
    bower: {
      dist: {
        options: {
          layout: "byType",
          cleanBowerDir: true,
          bowerOptions: {
            production: true
          },
          targetDir: "dist/vendor"
        }
      }
    },
    copy: {
      dist: {
        expand: true,
        cwd: 'app',
        src: ['**'],
        dest: 'dist/',
        options: {
          process: function(content) {
            return grunt.template.process(content);
          }
        }
      },
      development: {
        src: 'env/development.js',
        dest: 'dist/config.js'
      },
      production: {
        src: 'env/production.js',
        dest: 'dist/config.js'
      }
    },
    'couch-compile': {
      main: {
        files: {
          '.grunt/couchdb.json': 'couchdb/design-img.json'
        }
      }
    },
    'couch-push': {
      localhost: {
        files: {
          'http://localhost:5984/public': '.grunt/couchdb.json'
        }
      }
    },
    'gh-pages': {
      'gh-pages': {
        options: {
          base: 'dist'
        },
        src: ['**']
      }
    },
    watch: {
      app: {
        files: ['app/**'],
        tasks: ['copy:dist']
      }
    },
    connect: {
      server: {
        options: {
          base: "dist"
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
    this.async();
    var spawnPouchdbServer = require('spawn-pouchdb-server');

    spawnPouchdbServer({
      port: 5984,
      backend: false,
      log: {
        file: false
      },
      config: {
        file: false
      }
    }, function (error) {
      console.log('Started PouchDB server on http://localhost:5984');
    })
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-couch');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('start', ['connect:server', 'pouchdb']);
  grunt.registerTask('build', ['clean', 'copy:dist', 'bower']);
  grunt.registerTask('development', ['copy:development']);
  grunt.registerTask('production', ['copy:production']);
  grunt.registerTask('publish', ['build', 'production', 'gh-pages']);
};
