module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //test suite
    simplemocha: {
        all: {
          src: 'tests/*.js'
        }
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('default', 'simplemocha');
};
