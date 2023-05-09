// Вспомогательные модули (не для импорта)
const REG_EX_CONDITION = /\d/
// Все функции этого модуля Возвращают строковый sql запрос
class QuerryBuilder {
    static WHERE = "WHERE";
    static GROUP_BY = "GROUP BY";
    static ORDER_BY = "ORDER BY";
    static LIMIT = "LIMIT";

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
        if (limit != null && limit != 0)
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
    // Новый способ:
    // makeSubexpression(
    //     QuerryBuilder.WHERE,
    //     //на выбор есть ряд функций
    //     QuerryBuilder.equals("имя_1"),
    //     QuerryBuilder.AND,
    //     QuerryBuilder.notEquals("имя_2")
    // )
    // Код выдаст строку: WHERE имя_1 = $1 AND имя_2 != $2
    static makeSubexpression() {
        let subexpression = ``;
        let countArgs = 1;
        // возможно нужно будет дописывать по ходу дела, но пока так
        switch(arguments[0]) {
            case this.WHERE: {
                for (let i = 0; i < arguments.length; i++) {
                    if (subexpression != ``)
                        subexpression += ` `;
                    if (i % 2 == 1)
                        if (REG_EX_CONDITION.exec(arguments[i]) && REG_EX_CONDITION.exec(arguments[i]).index)
                            subexpression += `${arguments[i]}`;
                        else {
                            subexpression += `${arguments[i]}${countArgs++}`
                        }
                    else
                        subexpression += arguments[i];
                }
                break;
            }
            default: {
                for (let i = 0; i < arguments.length; i++) {
                    if (subexpression != ``)
                        subexpression += ` `;
                    subexpression += arguments[i];
                }
                break;
            }
        }
        return subexpression;
    }

}
module.exports = QuerryBuilder;