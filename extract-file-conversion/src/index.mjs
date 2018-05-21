require('dotenv').config();
const fs = require('fs');
const byline = require('byline');
const path = require('path');
const S = require('string');
const moment = require('moment');

const ssisTempFile = process.env.FILE_SSIS_TEMP;
const dirDataExtract = process.env.DIR_EXTRACT;
const fileNamePrefix = process.env.FILE_NAME_EXTRACT_PREFIX;
const timestamp = moment().format('YYYY-MM-DD-HHmm');
const tofile = `${dirDataExtract}/${fileNamePrefix}${timestamp}.csv`;

const eol = require('os').EOL;

const stream = byline(fs.createReadStream(ssisTempFile, { encoding: 'utf8' }));
const wrstr = fs.createWriteStream(tofile);
let lineNr = 0;
stream.on('data', line => {
  ++lineNr;

  const text = lineNr === 1 ? S(line).replaceAll('|', '#').s : line;
  wrstr.write(text + eol);
});
