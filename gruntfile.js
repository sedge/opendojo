module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'app.js', 'public/**/*.js', 'server/**/*.js', 'routes/**/*.js']
    },
    //test suite
    simplemocha: {
      options: {
        reporter: 'spec'
      },
      all: {
        src: 'tests/index.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Default is the same as test, for travis-ci
  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['jshint', 'simplemocha']);
};
