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
        src: 'tests/*.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('default', ['jshint', 'simplemocha']);
};
