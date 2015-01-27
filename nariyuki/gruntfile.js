module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //test suite
    mocha: {
      all: {
        src: ['tests/*.js'],
      },
      options: {
        run: true
      }
    }
  });

  // Load grunt mocha task
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('default', ['mocha']);
};
