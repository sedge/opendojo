module.exports = function(grunt){
  // Make grunt auto-load 3rd party tasks
  // and show the elapsed time of each task when
  // it runs
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
<<<<<<< HEAD
    jshint: "grunt-jsxhint",
    clean: "grunt-contrib-clean"
=======
    jshint: "grunt-jsxhint"
>>>>>>> a0f43d1250378722fcea9c1b416200f6b30525be
  });

  var reactify = require('grunt-react').browserify;
  var babelify = require('babelify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
<<<<<<< HEAD
        'server/**/*.js',
        'server/*.js',
        '!server/public/app.js',
=======
        'app.js',
        'public/**/*.js',
        'server/**/*.js',
        'routes/**/*.js',
        '!public/app.js',
>>>>>>> a0f43d1250378722fcea9c1b416200f6b30525be
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
<<<<<<< HEAD
          './server/public/app.js': ['./server/views/index.jsx']
=======
          'public/app.js': ['react/index.jsx']
>>>>>>> a0f43d1250378722fcea9c1b416200f6b30525be
        },
        options: {
          alias: [
            "react:react", "React:react"
          ],
          transform: [babelify,reactify]
        }
      }
    },
<<<<<<< HEAD
    clean: ['server/public/app.js', 'server/public/stylesheets/style.css'],
    less: {
      dev: {
        files: {
          "./server/public/stylesheets/style.css"
            : "./server/public/stylesheets/style.less"
        }
      }
    }
=======
    clean: ['public/app.js']
>>>>>>> a0f43d1250378722fcea9c1b416200f6b30525be
  });

  // Default is the same as test, for travis-ci
  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['jshint', 'exec:run_mocha']);
<<<<<<< HEAD
  grunt.registerTask('build', ['jshint', 'clean', 'browserify:dev', 'less:dev']);
=======
  grunt.registerTask('build', function(env) {
    var tasks;

    if (env === "prod") {
      tasks = ['jshint', 'clean', 'browserify:prod'];
    } else {
      tasks = ['jshint', 'clean', 'browserify:dev'];
    }

    grunt.task.run(tasks);
  });
>>>>>>> a0f43d1250378722fcea9c1b416200f6b30525be
};
