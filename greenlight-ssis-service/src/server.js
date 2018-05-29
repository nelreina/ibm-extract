require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('then-redis');
const bodyParser = require('body-parser');
const cors = require('cors');
const Log4js = require('log4js');
const argv = require('minimist')(process.argv.slice(2));

const routes = require('./routes');
const SSIS = require('./lib/ProjectSSIS');
Log4js.configure('./log4js.json');
const logger = Log4js.getLogger();

const publicPath = path.resolve(__dirname, '../public');

const mssqlConn = require('./mssql');
mssql = mssqlConn();
const connections = { mssql };

const ssis = new SSIS(connections, logger);

const app = express();
app.use(cors());
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(Log4js.connectLogger(logger, { level: 'debug' }));

const PORT = process.env.PORT;

(async () => {
  logger.info('Starting server...');

  routes(app, ssis, logger);
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(publicPath, 'index.html'));
  });
  app.listen(PORT, () => {
    logger.info(`App is running on port ${PORT}`);
  });
})();
