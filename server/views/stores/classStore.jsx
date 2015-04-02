var Reflux = require('reflux');
var request = require('superagent');

var { URL } = require('../bin/constants.jsx');
var classActions = require('../actions/classActions.jsx');

var {
  addClass,
  editClass,
  deleteClass
} = classActions;

var id = 0;

var classes = [];


var authActions = require('../actions/authActions.jsx');
var authStore = require('../stores/authStore.jsx');

var {
  logIn
} = authActions;

var authInfo;

var classStore = Reflux.createStore({
  listenables: classActions,
  init: function(){
    var that = this;

    this.listenTo(authStore, this.authUpdated, this.authUpdated);
  },
  // Initial getter for anything listening to
  // this store
  getInitialState: function() {
    return classes;
  },

  authUpdated: function(latestToken) {
    var that = this;

    authInfo = {
      "x-access-token": latestToken
    };

    request
      .get(URL + 'classes')
      .set(authInfo)
      .end(function (err, res) {
      if (err) {
        console.error("Error initializing the classStore: ", err);
      }

      if (res.body && res.body.length && res.body.length > 0) {
        classes = res.body;
      }

      that.trigger(classes);
    });
  },

  addClass: function(data){
    var that = this;

    var newClass = {
      classTitle: data.classTitle,
      dayOfWeek: Number(data.dayOfWeek),
      startTime: data.startTime,
      endTime : data.endTime,
      classType : data.classType.toString()
    };

    request
      .post(URL + 'classes')
      .set(authInfo)
      .send(newClass)
      .end(function(err, res){
        if(err){
          return addClass.failed(err);
        }

        classes.push(res.body);
        addClass.completed(classes);
      });
  },

  addClassCompleted: function(){
    this.trigger(classes);
  },

  addClassFailed: function(){
    this.trigger(classes);
  },

  deleteClass: function(id){
    var that = this;
    console.log(id);
    var course;
    var index;

    for(var i = 0; i < classes.length; i++){
      if(classes[i]._id == id) {
        course = classes[i];
        index = i;
        break;
      }
    }

    if (!course) {
      return deleteClass.failed("Cannot delete non-existant class");
    }

    request
      .del(URL + "class/" + id)
      .set(authInfo)
      .end(function(err, res){
        if (err) {
          return deleteClass.failed("API Error: " + err.toString());
        }

        // A delete returns 204 no matter what,
        // so we attempt a get request on the class
        // to confirm it was deleted
        request
          .get(URL + "class/" + id)
          .set(authInfo)
          .end(function(err, res) {
            console.log(res);
            if (res.text != "Invalid data!") {
              return deleteClass.failed("API Error: " + err.toString());
            }

            classes.splice(index, 1);
            deleteClass.completed(classes);
          });
      });
  },
  deleteClassFailed: function() {
    // Delete Error handling goes here
    this.trigger(classes);
  },
  deleteClassCompleted: function() {
    // Delete success handling goes here
    this.trigger(classes);
  },

  editClass: function(updatedInfo){
    var that = this;

    var course;
    var index;

    for(var i = 0; i < classes.length; i++){
      if(classes[i]._id == updatedInfo._id) {
        course = classes[i];
        index = i;
        break;
      }
    }

    if(!course) {
      return editClass.failed(classes);
    }

    var newClass = {
      classTitle: updatedInfo.classTitle,
      dayOfWeek: Number(updatedInfo.dayOfWeek),
      startTime: updatedInfo.startTime,
      endTime : updatedInfo.endTime,
      classType : updatedInfo.classType.toString()
    };

    request
      .put(URL + "class/" + updatedInfo._id)
      .set(authInfo)
      .send(newClass)
      .end(function(err, res) {
        if(err){
          return editClass.failed(err);
        }

        classes[index] = updatedInfo;
        editClass.completed(classes);
      });
  },
  editClassFailed: function() {
    this.trigger(classes);
  },
  editClassCompleted: function() {
    this.trigger(classes);
  }
});

module.exports = classStore;
