const DataExtract = require('./DataExtract');

module.exports = async (mssql, ext, logger) => {
  const DIR_OUTPUT = process.env.DIR_OUTPUT || './OUTPUT';
  const DIR_SQLSTMTS = process.env.DIR_SQLSTMTS || './SQLSTMTS';
  const options = { DIR_OUTPUT, DIR_SQLSTMTS, ext };
  const de = new DataExtract();

  de.on('log', data => logger.info(data));
  try {
    await de.run(mssql, options);
  } catch (error) {
    logger.error(error);
  }
  process.exit(0);
};
