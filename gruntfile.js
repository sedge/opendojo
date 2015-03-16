module.exports = function(grunt){
  // Make grunt auto-load 3rd party tasks
  // and show the elapsed time of each task when
  // it runs
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    jshint: "grunt-jsxhint",
    clean: "grunt-contrib-clean"
  });

  var reactify = require('grunt-react').browserify;
  var babelify = require('babelify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'server/**/*.js',
        'server/*.js'
        '!public/app.js',
        'react/*.jsx',
        'react/**/*.jsx'
      ],
      options: {
        esnext: true
      }
    },
    exec: {
      run_mocha: {
        command: 'mocha --timeout 1000 --recursive --reporter spec tests/index.js',
        options: {
          // Use the env from the process, but alter a few things for logging
          env: (function(env) {
            env.LOG_LEVEL = 'fatal';
            env.NODE_ENV = 'development';
            return env;
          }(process.env))
        },
        stdout: true,
        stderr: true
      }
    },
    browserify: {
      dev: {
        files: {
          'public/app.js': ['react/index.jsx']
        },
        options: {
          alias: [
            "react:react", "React:react"
          ],
          transform: [babelify,reactify]
        }
      }
    },
    clean: ['public/app.js', 'public/stylesheets/style.css'],
    less: {
      dev: {
        files: {
          "./public/stylesheets/style.css": "./public/stylesheets/style.less"
        }
      }
    }
  });

  // Default is the same as test, for travis-ci
  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['jshint', 'exec:run_mocha']);
  grunt.registerTask('build', ['jshint', 'clean', 'browserify:dev', 'less:dev']);
};
