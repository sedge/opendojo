/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */


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
          models.Attendance.remove(function(err){
            if(err){
              console.log("Error removing! ",err);
              return process.exit(1);
            }
            console.log('All attendance sample data removed');
            models.Message.remove(function(err){
            process.exit();
            });
          });
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
