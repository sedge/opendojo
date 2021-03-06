/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var db = require("../server/lib/db");
var models = require("../server/models")(db.connection);

function _generateMessageData() {
  var m1 = new models.Message({
    messageText: 'Please enter your text'
  });

  models.Message.find({}, function(err, messages) {
    if (err) {
        console.error(err);
        return process.exit(1);
    }
    if (messages.length === 0)
    {
      m1.save(function(err, m1) {
        if (err) {
          console.error(err);
          return process.exit(1);
        }

        models.Message.find({}, function(err, message) {
          if (err) {
            return process.exit(1);
          }

          console.log(message);
          console.log("The initial message has been successfully generated.")
          process.exit();
        });
      });
    }else{
      console.log("The initial message already exists.")
      return process.exit();
    }
  });
}

if (db.health.connected) {
  _generateMessageData();
} else {
  db.health.once("connected", function() {
    _generateMessageData();
  });
}
