'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('../_utils/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = _express2.default.Router();

var bankLoads = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _index.invokeSQLCmd)('\n\t\tSELECT\n\t\t\tbl.id BankLoadId,\n\t\t\tLoadYearMonth,\n\t\t\tWeeknumber,\n\t\t\tPeriod,\n\t\t\tDataFileName,\n\t\t\tbl.InsertDate,\n\t\t\tmp.Id MatchProcessId,\n\t\t\ttp.ID periodId,\n\t\t\treport.sfGetPreviousMatchProcessId(bl.id) PreviousMatchProcessId\n\t\tFROM\n\t\t\tdbo.BankLoad bl,\n\t\t\tdbo.TypeOfPeriod tp,\n\t\t\tdbo.MatchProcess mp\n\t\tWHERE\n\t\t\tbl.TypeOfPeriod_Id = tp.id and \n\t\t\tmp.BankLoad_Id = bl.id and\n\t\t\tbl.TypeOfPeriod_Id in(2,4)\n\t\tORDER BY\n\t\t\tbl.id DESC\n\t\t');

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function bankLoads() {
    return _ref.apply(this, arguments);
  };
}();

var balanceStats = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(MatchProcessId) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _index.invokeSQLCmd)('\nWITH balance\n     AS (SELECT m0001,\n                LEFT(reportitem, 1) AS btype,\n                SUM(amount/1000) AS amount\n         FROM report.balancesheet AS b\n         WHERE b.matchprocess_id =  ' + MatchProcessId + '\n               AND b.m0001 IS NOT NULL\n         GROUP BY m0001,\n                  LEFT(reportitem, 1))\n     SELECT Replace(M0001, \'Banco di Caribe\', \'\') M0001,\n            SUM(CASE\n                    WHEN btype = 1\n                    THEN amount\n                    ELSE 0\n                END) AS assets,\n            SUM(CASE btype\n                    WHEN 2\n                    THEN amount\n                    ELSE 0\n                END) AS liabilities,\n            SUM(CASE btype\n                    WHEN 3\n                    THEN amount\n                    ELSE 0\n                END) AS equity\n     FROM balance\n     GROUP BY m0001 ORDER BY m0001\t');

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function balanceStats(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var capitalPrevPeriod = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(MatchProcessId) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _index.invokeSQLCmd)('\n\t\tselect \n\t\t\tent.*,\n\t\t\tcap.Capital\n\t\tfrom report.Entities ent \n\t\t\tleft outer join report.EntitiesPeriodCapital cap\n\t\t\ton (ent.id = cap.EntityId and cap.MatchProcess_Id = ' + MatchProcessId + ')\t\n\t');

          case 2:
            return _context3.abrupt('return', _context3.sent);

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function capitalPrevPeriod(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var correctionStats = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(BankLoadId) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _index.invokeSQLCmd)('\n\t\tselect s.StatusName [label], sum(case when p.id is null then 0 else 1 end) [value]\n\t\tfrom  dbo.ProposedCorrectionStatus s left outer join dbo.ProposedCorrection  p \n\t\ton (p.ProposedStatus = s.id and BankLoadId = ' + BankLoadId + ' )  \n\t\tWHERE s.id in (1,3,4)\n\t\tgroup by s.StatusName\n\t');

          case 2:
            return _context4.abrupt('return', _context4.sent);

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function correctionStats(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
var bankloadStats = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(BankLoadId) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _index.invokeSQLCmd)('\n\t\tselect \'Bankload\' label,\n\t\tBankDataCounter value\n\t\tfrom dbo.BankLoad\n\t\twhere id = ' + BankLoadId + '\n\t\tunion all \n\t\tselect \'Matched Rows\',\n\t\tMatchedRows\n\t\tfrom MatchProcess\n\t\twhere BankLoad_id = ' + BankLoadId + '\n\t');

          case 2:
            return _context5.abrupt('return', _context5.sent);

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function bankloadStats(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

var matchLog = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(processkey) {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _index.invokeSQLCmd)('\n\t\tselect *\n\t\tfrom report.Log \n\t\twhere\tProcessKey = ' + processkey + '\n\t\torder by id desc\n\t');

          case 2:
            return _context6.abrupt('return', _context6.sent);

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function matchLog(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

api.get('/list', function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(req, res) {
    var data;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return bankLoads();

          case 3:
            data = _context7.sent;

            res.status(200).json(data);
            _context7.next = 10;
            break;

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7['catch'](0);

            res.status(503).send(_context7.t0);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[0, 7]]);
  }));

  return function (_x6, _x7) {
    return _ref7.apply(this, arguments);
  };
}());
api.get('/log/:processkey', function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(req, res) {
    var data;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return matchLog(req.params.processkey);

          case 3:
            data = _context8.sent;

            res.status(200).json(data);
            _context8.next = 10;
            break;

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8['catch'](0);

            res.status(503).send(_context8.t0);

          case 10:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[0, 7]]);
  }));

  return function (_x8, _x9) {
    return _ref8.apply(this, arguments);
  };
}());
api.get('/stats-correction/:BankloadId', function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(req, res) {
    var data;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return correctionStats(req.params.BankloadId);

          case 3:
            data = _context9.sent;

            res.status(200).json(data);
            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9['catch'](0);

            res.status(503).send(_context9.t0);

          case 10:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined, [[0, 7]]);
  }));

  return function (_x10, _x11) {
    return _ref9.apply(this, arguments);
  };
}());
api.get('/stats/:BankloadId', function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(req, res) {
    var data;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return bankloadStats(req.params.BankloadId);

          case 3:
            data = _context10.sent;

            res.status(200).json(data);
            _context10.next = 10;
            break;

          case 7:
            _context10.prev = 7;
            _context10.t0 = _context10['catch'](0);

            res.status(503).send(_context10.t0);

          case 10:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[0, 7]]);
  }));

  return function (_x12, _x13) {
    return _ref10.apply(this, arguments);
  };
}());
api.get('/stats-balance/:MatchProcessId', function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(req, res) {
    var data;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return balanceStats(req.params.MatchProcessId);

          case 3:
            data = _context11.sent;

            res.status(200).json(data);
            _context11.next = 10;
            break;

          case 7:
            _context11.prev = 7;
            _context11.t0 = _context11['catch'](0);

            res.status(503).send(_context11.t0);

          case 10:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[0, 7]]);
  }));

  return function (_x14, _x15) {
    return _ref11.apply(this, arguments);
  };
}());
api.get('/capital/:MatchProcessId', function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(req, res) {
    var data;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return capitalPrevPeriod(req.params.MatchProcessId);

          case 3:
            data = _context12.sent;

            res.status(200).json(data);
            _context12.next = 10;
            break;

          case 7:
            _context12.prev = 7;
            _context12.t0 = _context12['catch'](0);

            res.status(503).send(_context12.t0);

          case 10:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined, [[0, 7]]);
  }));

  return function (_x16, _x17) {
    return _ref12.apply(this, arguments);
  };
}());

module.exports = api;