/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

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
        'server/*.js',
        '!server/public/app.js',
        'react/*.jsx',
        'react/**/*.jsx'
      ],
      options: {
        esnext: true
      }
    },
    exec: {
      run_mocha: {
        command: 'mocha --timeout 10000 --recursive --reporter spec tests/index.js',
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
          './server/public/app.js': ['./server/views/index.jsx']
        },
        options: {
          alias: [
            "react:react", "React:react"
          ],
          transform: [babelify,reactify],
          watch: true,
          keepAlive: true,
          debug: true
        }
      },
      prod: {
        files: {
          './server/public/app.js': ['./server/views/index.jsx']
        },
        options: {
          alias: [
            "react:react", "React:react"
          ],
          transform: [babelify,reactify],
          debug: true
        }
      }
    },
    clean: ['server/public/app.js', 'server/public/stylesheets/style.css'],
    less: {
      dev: {
        files: {
          "./server/public/stylesheets/style.css"
            : "./server/public/stylesheets/style.less"
        }
      }
    },
    watch: {
      files: "./server/public/stylesheets/style.less",
      tasks: ["less:dev"]
    },
    uglify: {
      prod: {
        files: {
          'server/public/app.js': 'server/public/app.js'
        }
      }
    }
  });

  // Default is the same as test, for travis-ci
  grunt.registerTask('default', ['test', 'build']);
  grunt.registerTask('test', ['jshint', 'exec:run_mocha']);
  grunt.registerTask('build-less', ['watch']);
  grunt.registerTask('build-dev', ['jshint', 'clean', 'less:dev', 'browserify:dev']);
  grunt.registerTask('build', ['jshint', 'clean', 'less:dev', 'browserify:prod', 'uglify:prod']);
};
