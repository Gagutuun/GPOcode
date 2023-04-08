function makeInsertQuerry(tableName, columnNames, addableArgs) {
    let sqlQuerry = `INSERT INTO ${tableName} (`;
    columnNames.forEach(columnName => {
        sqlQuerry += columnName;
    });
    sqlQuerry += `) VALUES (`;
    addableArgs.forEach(arg => {
        sqlQuerry += arg + `, `;
    });
    sqlQuerry = sqlQuerry.replace(sqlQuerry.substring(sqlQuerry.lastIndexOf(', ')), ')');
    return sqlQuerry;
}

function makeSelectQuerry(columnNames, tableName, whenExpression, groupByExpression, orderByExpression) {
    let sqlQuerry = `SELECT `;
    if (columnNames === null)
        sqlQuerry += `* FROM ${tableName}`;
    else {
        columnNames.forEach(columnName => {
            sqlQuerry += `${columnName}, `;
        })
        sqlQuerry = sqlQuerry.replace(sqlQuerry.substring(sqlQuerry.lastIndexOf(', ')), `FROM ${tableName}`);
    }
    if (whenExpression != null)
        sqlQuerry += ` WHEN ${whenExpression}`;
    if (groupByExpression != null)
        sqlQuerry += ` GROUP BY ${groupByExpression}`;
    if (orderByExpression != null)
        sqlQuerry += `ORDER BY ${orderByExpression}`;
    return sqlQuerry;
}

module.exports = { makeInsertQuerry, makeSelectQuerry };

console.log(makeInsertQuerry(`public."Protocol"`, new Array('file_protocol_doc'), new Array('./AnyPath')));

console.log(makeSelectQuerry(null, `public."Protocol"`, null, null, null));