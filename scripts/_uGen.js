var db = require("../server/lib/db");
var models = require("../server/models")(db.connection);

function _generateUserData() {
  var u1 = new models.User({
    username: "admin",
    password: "passW0rd"
  });

  u1.save(function(err, u1) {
    if (err) {
      console.error(err);
      return process.exit(1);
    }

    models.User.find({}, function(err, users) {
      if (err) {
        return process.exit(1);
      }

      console.log(users);
      process.exit();
    });
  });
}

if (db.health.connected) {
  _generateUserData();
} else {
  db.health.once("connected", function() {
    _generateUserData();
  });
}
