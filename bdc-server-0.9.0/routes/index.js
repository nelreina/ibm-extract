'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
	console.log('Importing routes...');
	_fs2.default.readdirSync(__dirname).filter(function (file) {
		return file.indexOf(".") !== 0 && file !== "index.js";
	}).forEach(function (file) {
		var routepath = file.replace('.js', '');
		console.log(routepath);
		app.use('/api/' + routepath, require(_path2.default.join(__dirname, file)));
	});
};