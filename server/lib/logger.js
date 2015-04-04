var bunyan = require("bunyan");
var env = require("./environment");
var PrettyStream = require("bunyan-prettystream");

var NODE_ENV = env.get("NODE_ENV") || "development";
var stream;
var logger;

var opts = {
  name: "opendojo",
  level: env.get("LOG_LEVEL") || "info",
  serializers: {
    err: bunyan.stdSerializers.err,
    res: bunyan.stdSerializers.res,
    req: function request(req) {
      return {
        httpType: "Request",
        method: req.method,
        url: req.url,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort,
        body: req.body || "No body"
      };
    },
    student: function(student) {
      return {
        id: student._id,
        name: student.lastName + ", " + student.firstName,
      };
    }
  }
};

if(NODE_ENV === "development") {
  // In development, we pretty print the JSON logging to stdout.
  stream = new PrettyStream();
  stream.pipe(process.stdout);

  // Also, include code info in all logs
  opts.src = true;
} else {
  stream = process.stdout;
}
opts.stream = stream;

logger = bunyan.createLogger(opts);

module.exports = logger;