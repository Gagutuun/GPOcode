// Все функции этого модуля Возвращают строковый sql запрос
class QuerryBuilder {
    static WHERE = "WHERE ";
    static GROUP_BY = "GROUP BY ";
    static ORDER_BY = "ORDER BY ";
    static LIMIT = "LIMIT ";

    static AND = "AND";
    static OR = "OR";
    static NOT = "NOT";
    static DESC = "DESC";

    // Функции для составления условий
    static equals(columnName) {
        return `${columnName} = $`;
    }
    static bigger(columnName) {
        return `${columnName} > $`;
    }
    static smaller(columnName) {
        return `${columnName} < $`;
    }
    static notEquals(columnName) {
        return `${columnName} != $`;
    }
    static notBigger(columnName) {
        return `${columnName} <= $`;
    }
    static notSmaller(columnName) {
        return `${columnName} >= $`;
    }

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
            sqlQuery += ` ${whereExpression}`;
        if (groupByExpression != null)
            sqlQuery += ` ${groupByExpression}`;
        if (orderByExpression != null)
            sqlQuery += ` ${orderByExpression}`;
        if (limit != 0 && limit != null)
            sqlQuery += ` ${limit}`;
        return sqlQuery;
    }

    // Создает подвыражение для запросов. P.S. соединяет все пробелами
    // Пример использования:
    // makeSubexpression(
    //     QuerryBuilder.WHERE,
    //     "Условие 1",
    //     QuerryBuilder.AND,
    //     "Условие 2"
    // )
    // Код выдаст следующее выражение: WHERE Условие 1 AND Условие 2
    // 
    static makeSubexpression() {
        let subexpression = ``;
        for (let i = 0; i < arguments.length; i++) {
            if (subexpression != ``)
                subexpression += ` `;
            subexpression += `${arguments[i]}`;
            if (i != 0)
                subexpression += `${i}`;
        }
        return subexpression;
    }

}
module.exports = QuerryBuilder;