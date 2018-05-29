const converter = require('json-2-csv');
exports.toCSV = jsonArray =>
  new Promise((resolve, reject) => {
    converter.json2csv(jsonArray, (err, csv) => {
      if (err) return reject(err);
      resolve(csv);
    });
  });

exports.toJSON = csv =>
  new Promise((resolve, reject) => {
    converter.csv2json(csv, (err, json) => {
      if (err) return reject(err);
      resolve(json);
    });
  });
