// Все функции этого модуля Возвращают строковый sql запрос

// функция makeInsertQuery() принимает:
//     имя таблицы (tableName),
//     массив имен столбцов таблицы (columnNames),
//     число аргументов (значений, записей), которое будет добавлено в таблицу (nArgs)
function makeInsertQuery(tableName, columnNames, nArgs) {
    let sqlQuery = `INSERT INTO ${tableName} (`;
    columnNames.forEach(columnName => {
        sqlQuery += columnName;
    });
    sqlQuery += `) VALUES (`;
    for (i = 0; i < nArgs; i++) {
        sqlQuery += `$${i + 1}, `;
    }
    sqlQuery = sqlQuery.slice(0, sqlQuery.lastIndexOf(', ')) + ')';
    return sqlQuery;
}

// функция makeSelectQuery() принимает:
//     массив имен столбцов (),
//     имя таблицы (),
//     условие отбора записей (),
//     условие группировки (),
//     условие сортировки ().
// P.S. Все условия пишутся БЕЗ ключевых sql слов (WHERE, GROUP BY, ORDER BY)
// P.P.S. Функция не проверялась на деле, возможно нужны правки
function makeSelectQuery(columnNames, tableName, whereExpression, groupByExpression, orderByExpression) {
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
        sqlQuery += ` WHERE ${whereExpression}`;
    if (groupByExpression != null)
        sqlQuery += ` GROUP BY ${groupByExpression}`;
    if (orderByExpression != null)
        sqlQuery += `ORDER BY ${orderByExpression}`;
    return sqlQuery;
}

module.exports = { makeInsertQuery, makeSelectQuery };