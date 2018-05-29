require('dotenv').config();
module.exports = dialect => {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  let options;
  try {
    options = JSON.parse(process.env.DB_OPTIONS);
  } catch (error) {
    console.info('DB_OPTIONS should be a JSON string!');
    options = {};
  }
  const conn = { username, password, database };
  switch (dialect) {
    case 'mssql':
      options.host = host;
      if (port) {
        options.port = parseInt(port);
      }
      options.dialect = dialect;
      options.operatorsAliases = false;
      conn.options = options;
      break;
    case 'mysql':
    case 'postgres':
      conn.host = host;
      conn.dialect = dialect;
      break;
    default:
  }
  return conn;
};
