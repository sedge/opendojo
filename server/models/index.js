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
