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
            production: false
          }
        }
      }
    },
    clean: {
      app: ["app/lib/*", "!app/lib/viz.js", "app/js/parser"],
      bower: ["lib"]
    },
    nodestatic: {
      serve: {
        options: {
          port: 9999,
          dev: true,
          base: 'app'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodestatic');

  // Default task(s).
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['clean:app', 'bower:app']);
};
