const { sqllize } = require('../index');

const { getConnectionObject, getConnection, invokeSQLCmd } = sqllize;
const conn = getConnection('mssql');
console.info('sqllize test postgres:', JSON.stringify(getConnectionObject('postgres')));

(async () => {
    const ret = await invokeSQLCmd(conn, 'select * from columndef');
    console.info(ret);

})();