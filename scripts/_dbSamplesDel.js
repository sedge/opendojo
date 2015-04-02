var db = require("../server/lib/db");
var models = require("../server/models")(db);

function _clearSampleData() {
  models.Student.remove(function(err){
    if(err){
      console.log("Error removing! ", err);
      return process.exit(1);
    }

    console.log('All student sample data removed');
    models.Rank.remove(function(err){
      if(err){
        console.log("Error removing! ", err);
        return process.exit(1);
      }

      console.log('All rank sample data removed');
      models.User.remove(function(err){
        if(err){
          console.log("Error removing! ", err);
          return process.exit(1);
        }

        console.log('All user sample data removed');
        models.Class.remove(function(err){
          if(err){
            console.log("Error removing! ",err);
            return process.exit(1);
          }
          console.log('All class sample data removed');
          process.exit();
        });

        
      });
    });
  });
}

if (db.health.connected) {
  _clearSampleData();
} else {
  db.health.once("connected", function() {
    _clearSampleData();
  });
}
