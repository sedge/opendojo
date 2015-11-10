/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

module.exports = function(connection) {
  return {
    User: require("./user")(connection),
    Rank: require("./rank")(connection),
    Student: require("./student")(connection),
    Class: require("./class")(connection),
    Attendance: require("./attendance")(connection),
    Message: require("./message")(connection)
  };
};
