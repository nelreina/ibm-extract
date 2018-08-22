"use strict";

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressValidator = require("express-validator");

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _config = require("./config.json");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = console.log;
var app = (0, _express2.default)();
var port = _config2.default.port || 3000;

app.use((0, _cors2.default)());
app.use((0, _compression2.default)());
app.use((0, _morgan2.default)("combined"));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _expressValidator2.default)());

log("Starting Greenlight Model Config Server");

(0, _routes2.default)(app);
// Not Found Routes
app.all("/*", function (req, res) {
  res.status(401).send({ message: "Not authorized" });
});

var server = _http2.default.createServer(app);

server.listen(port, function () {
  return log("App is served on port " + port);
});