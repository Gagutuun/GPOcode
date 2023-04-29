// Все функции этого модуля Возвращают строковый sql запрос
class QuerryBuilder {
    static AND = "AND";
    static OR = "OR";
    static NOT = "NOT";
    static DESC = "DESC";

    // функция makeInsertQuery() принимает:
    //     имя таблицы (tableName),
    //     массив имен столбцов таблицы (columnNames),
    //     число аргументов (значений, записей), которое будет добавлено в таблицу (nArgs)
    static makeInsertQuery(tableName, columnNames, nArgs) {
        let sqlQuery = `INSERT INTO ${tableName} (`;
        columnNames.forEach(columnName => {
            if (sqlQuery != `INSERT INTO ${tableName} (`)
                sqlQuery += `, `;
            sqlQuery += columnName;
        });
        sqlQuery += `) VALUES (`;
        for (let i = 0; i < nArgs; i++) {
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
    static makeSelectQuery(
        columnNames,
        tableName,
        whereExpression,
        groupByExpression,
        orderByExpression,
        limit
    ) {
        let sqlQuery = `SELECT `;
        if (columnNames === null)
            sqlQuery += `*`;
        else {
            columnNames.forEach(columnName => {
                if (sqlQuery != `SELECT `)
                    sqlQuery += `, `;
                sqlQuery += `${columnName}`;
            })
        }
        sqlQuery += ` FROM ${tableName}`;
        if (whereExpression != null)
            sqlQuery += ` WHERE ${whereExpression}`;
        if (groupByExpression != null)
            sqlQuery += ` GROUP BY ${groupByExpression}`;
        if (orderByExpression != null)
            sqlQuery += ` ORDER BY ${orderByExpression}`;
        if (limit != 0 && limit != null)
            sqlQuery += ` LIMIT ${limit}`;
        return sqlQuery;
    }

    static makeSubexpression() {
        let subexpression = ``;
        for (let i = 0; i < arguments.length; i++) {
            if (subexpression != ``)
                subexpression += ` `;
            subexpression += `${arguments[i]}`;
        }
        return subexpression;
    }

}

module.exports = QuerryBuilder;