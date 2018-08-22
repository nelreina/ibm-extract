'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('../_utils/index');

var _lodash = require('lodash');

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _config = require('../config.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Reports = [];

var entityList = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _index.invokeSQLCmd)('select * from report.Entities');

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function entityList() {
    return _ref.apply(this, arguments);
  };
}();

var api = _express2.default.Router();

var loadReportsFromDB = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _index.invokeSQLCmd)('select * from GreenlightConfig.breakdown.Report order by orderNr');

          case 3:
            Reports = _context2.sent;

            console.log(Reports.length + ' report(s) succesfully loaded! ');
            _context2.next = 11;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);

            console.log('Failed loading reports');
            console.log(_context2.t0);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 7]]);
  }));

  return function loadReportsFromDB() {
    return _ref2.apply(this, arguments);
  };
}();
var fetchReportData = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(sql) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var sqlStmt;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sqlStmt = '';

            if ((0, _lodash.isEmpty)(params)) {
              sqlStmt = sql;
            } else {
              sqlStmt = (0, _string2.default)(sql).template(params).s;
            }
            // console.log(sqlStmt);
            _context3.next = 4;
            return (0, _index.invokeSQLCmd)(sqlStmt);

          case 4:
            return _context3.abrupt('return', _context3.sent);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function fetchReportData(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var getReport = function getReport(reportId) {
  return (0, _lodash.find)(Reports, function (r) {
    return r.Code === reportId || r.ID === parseInt(reportId);
  });
};
var getReportList = function getReportList() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'gl';

  var list = Reports.filter(function (r) {
    return (r.role === _config.client || r.role === '*') && r.role !== 'SYS';
  }).filter(function (r) {
    return r.type === type.toUpperCase();
  }).map(function (l) {
    var m = (0, _assign2.default)({}, l);
    delete m.sqlstmt;
    return m;
  });
  return list;
};
var getColumnDefs = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(columnDefId) {
    var promisses, _ref5, _ref6, columnDef, defaultColDef;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            promisses = [];

            promisses.push((0, _index.invokeSQLCmd)('select * from GreenlightConfig.breakdown.columnDefDetails where columnDefId = ' + columnDefId + ' order by orderNr'));
            promisses.push((0, _index.invokeSQLCmd)('select * from GreenlightConfig.breakdown.columnDef where ID = ' + columnDefId, true));
            _context4.next = 5;
            return _promise2.default.all(promisses);

          case 5:
            _ref5 = _context4.sent;
            _ref6 = (0, _slicedToArray3.default)(_ref5, 2);
            columnDef = _ref6[0];
            defaultColDef = _ref6[1];
            return _context4.abrupt('return', { columnDef: columnDef, defaultColDef: defaultColDef });

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getColumnDefs(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

loadReportsFromDB();

/** ############################################################################ */
/**                                  ROUTES                                      */
/** ############################################################################ */
api.get('/list/:type?', function (req, res) {
  return res.send(getReportList(req.params.type));
});

api.get('/entity-list', function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(req, res) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.t0 = res;
            _context5.next = 3;
            return entityList(req.body);

          case 3:
            _context5.t1 = _context5.sent;
            return _context5.abrupt('return', _context5.t0.send.call(_context5.t0, _context5.t1));

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x5, _x6) {
    return _ref7.apply(this, arguments);
  };
}());

api.post('/details', function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(req, res) {
    var _req$body, reportCode, M0001, coaColumn, CoaCode, report, sql, promisses, _ref9, _ref10, meta, data;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$body = req.body, reportCode = _req$body.reportCode, M0001 = _req$body.M0001, coaColumn = _req$body.coaColumn, CoaCode = _req$body.CoaCode;
            report = getReport(reportCode + '-D');
            sql = report.sqlstmt;

            sql += M0001 ? ' and match.M0001 = \'' + M0001 + '\'' : '';
            sql += CoaCode ? ' and match.CoaCode = \'' + CoaCode + '\'' : '';
            sql += coaColumn ? ' and match.CoaColumn = \'' + coaColumn + '\'' : '';
            promisses = [getColumnDefs(report.columnDefId), fetchReportData(sql, req.body)];
            _context6.next = 9;
            return _promise2.default.all(promisses);

          case 9:
            _ref9 = _context6.sent;
            _ref10 = (0, _slicedToArray3.default)(_ref9, 2);
            meta = _ref10[0];
            data = _ref10[1];

            res.json({ meta: meta, data: data });

          case 14:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x7, _x8) {
    return _ref8.apply(this, arguments);
  };
}());

api.get('/reload/:type?', function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(req, res) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return loadReportsFromDB();

          case 2:
            res.send(getReportList(req.params.type));

          case 3:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function (_x9, _x10) {
    return _ref11.apply(this, arguments);
  };
}());

api.get('/fetch-def/:reportId', function (req, res) {
  var report = getReport(req.params.reportId);
  if (report) {
    getColumnDefs(report.columnDefId).then(function (data) {
      return res.status(200).json(data);
    }).catch(function (err) {
      return res.status(500).send(err);
    });
  } else {
    res.status(500).send({ error: 'Report does not exist !' });
  }
});

api.post('/fetch-data/:reportId', function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(req, res) {
    var report, params, data;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            report = getReport(req.params.reportId);

            if (!report) {
              _context8.next = 10;
              break;
            }

            params = req.body.params;
            _context8.next = 6;
            return fetchReportData(report.sqlstmt, params);

          case 6:
            data = _context8.sent;

            res.status(200).json(data);
            _context8.next = 11;
            break;

          case 10:
            res.status(500).send({ message: 'Report does not exist !' });

          case 11:
            _context8.next = 16;
            break;

          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8['catch'](0);

            res.status(500, _context8.t0);

          case 16:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[0, 13]]);
  }));

  return function (_x11, _x12) {
    return _ref12.apply(this, arguments);
  };
}());

module.exports = api;