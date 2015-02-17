module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'app.js', 'public/**/*.js', 'server/**/*.js', 'routes/**/*.js']
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');

  // Default is the same as test, for travis-ci
  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['jshint', 'exec:run_mocha']);
};
