App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.route('about',{path:"/about"});
  this.route('student',{path:"/student"});
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['Model1', 'Model2', 'Model3'];
  }
});