const Sequelize = require('sequelize');
const getConnectionObject = require('./get-connection-object');
module.exports = (dialect) => {
    const connectionObject = getConnectionObject(dialect);
    if (dialect === 'mssql') {
        const { database, username, password, options } = connectionObject;
        return new Sequelize(database, username, password, options);
    }
    return new Sequelize(connectionObject);

}