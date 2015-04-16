var db = require("../server/lib/db");
var models = require("../server/models")(db.connection);

function _generateMessageData() {
  var m1 = new models.Message({
    _id: 'customMessage',
    messageText: 'Please enter your text' 
  });

  m1.save(function(err, m1) {
    if (err) {
      console.error(err);
      return process.exit(1);
    }

    models.Message.find({}, function(err, messages) {
      if (err) {
        return process.exit(1);
      }

      console.log(messages);
      process.exit();
    });
  });
}

if (db.health.connected) {
  _generateMessageData();
} else {
  db.health.once("connected", function() {
    _generateMessageData();
  });
}
