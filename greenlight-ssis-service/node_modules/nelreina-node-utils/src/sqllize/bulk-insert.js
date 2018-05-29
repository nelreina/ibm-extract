module.exports = async (db, tableName, filename, del = ',') => {
  const sqlstmt = `BULK INSERT ${tableName} FROM '${filename}' 
            WITH (FIRSTROW=2, FIELDTERMINATOR='${del}',ROWTERMINATOR='\\n')`;
  const ret = await db.query(sqlstmt, { type: db.QueryTypes.INSERT });
  let obj = {};
  obj[tableName] = ret[1] ? ret[1] : 0;
  return obj;
};
