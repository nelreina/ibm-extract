"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invokeSQLCmd = exports.findObject = exports.toCSV = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _json2Csv = require("json-2-csv");

var _json2Csv2 = _interopRequireDefault(_json2Csv);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _config = require("../config.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = _config.GreenLightDB.database,
    username = _config.GreenLightDB.username,
    password = _config.GreenLightDB.password,
    options = _config.GreenLightDB.options;


var mssql = new _sequelize2.default(database, username, password, options);
console.log("Database Connected to host:" + options.host + " | dbname:" + database);

var invokeSQLCmd = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(query) {
    var returnObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var result, message, name;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = void 0;
            _context.prev = 1;
            _context.next = 4;
            return mssql.query(query, { type: mssql.QueryTypes.SELECT });

          case 4:
            result = _context.sent;

            if (returnObject) {
              result = result.length > 0 ? result[0] : {};
            }
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            message = _context.t0.message, name = _context.t0.name;

            result = { message: message, name: name };
            // result = error;

          case 12:
            return _context.abrupt("return", result);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 8]]);
  }));

  return function invokeSQLCmd(_x2) {
    return _ref.apply(this, arguments);
  };
}();

var toCSV = function toCSV(jsonArray) {
  return new _promise2.default(function (resolve, reject) {
    _json2Csv2.default.json2csv(jsonArray, function (err, csv) {
      if (err) return reject(err);
      resolve(csv);
    });
  });
};
var findObject = function findObject(data, field, code) {
  var f = data.filter(function (d) {
    return d[field] === code;
  });
  if (f.length === 1) {
    return f[0];
  } else {
    return {};
  }
};
exports.toCSV = toCSV;
exports.findObject = findObject;
exports.invokeSQLCmd = invokeSQLCmd;