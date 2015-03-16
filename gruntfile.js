module.exports = function(grunt){
  // Make grunt auto-load 3rd party tasks
  // and show the elapsed time of each task when
  // it runs
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    jshint: "grunt-jsxhint"
  });

  var reactify = require('grunt-react').browserify;
  var babelify = require('babelify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'app.js',
        'public/**/*.js',
        'server/**/*.js',
        'routes/**/*.js',
        '!public/app.js',
        'react/*.jsx',
        'react/**/*.jsx'
      ],
      options: {
        esnext: true
      }
    },
    //test suite
    exec: {
      run_mocha: {
        command: 'mocha --timeout 1000 --recursive --reporter spec tests',
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
          transform: [reactify, babelify]
        }
      }
    },
    clean: ['dist/app.js']
  });

  // Default is the same as test, for travis-ci
  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['jshint', 'exec:run_mocha']);
  grunt.registerTask('build', function(env) {
    var tasks;

    if (env === "prod") {
      tasks = ['jshint', 'browserify:prod'];
    } else {
      tasks = ['jshint', 'browserify:dev'];
    }

    grunt.task.run(tasks);
  });
};
