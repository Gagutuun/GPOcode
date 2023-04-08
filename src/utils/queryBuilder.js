function makeInsertQuery(tableName, columnNames, nArgs) {
    let sqlQuery = `INSERT INTO ${tableName} (`;
    columnNames.forEach(columnName => {
        sqlQuery += columnName;
    });
    sqlQuery += `) VALUES (`;
    for (i = 0; i < nArgs; i++) {
        sqlQuery += `$${i + 1}, `;
        console.log(i);
    }
    sqlQuery = sqlQuery.slice(0, sqlQuery.lastIndexOf(', ')) + ')';
    return sqlQuery;
}

function makeSelectQuery(columnNames, tableName, whenExpression, groupByExpression, orderByExpression) {
    let sqlQuery = `SELECT `;
    if (columnNames === null)
        sqlQuery += `* FROM ${tableName}`;
    else {
        columnNames.forEach(columnName => {
            sqlQuery += `${columnName}, `;
        })
        sqlQuery = sqlQuery.replace(sqlQuery.substring(sqlQuery.lastIndexOf(', ')), `FROM ${tableName}`);
    }
    if (whenExpression != null)
        sqlQuery += ` WHEN ${whenExpression}`;
    if (groupByExpression != null)
        sqlQuery += ` GROUP BY ${groupByExpression}`;
    if (orderByExpression != null)
        sqlQuery += `ORDER BY ${orderByExpression}`;
    return sqlQuery;
}

module.exports = { makeInsertQuery, makeSelectQuery };