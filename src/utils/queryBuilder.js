// Вспомогательные модули (не для импорта)
const REG_EX_CONDITION = /\d/
const REG_EX_WHERE_CONDITION = /[$]/
// Все функции этого модуля Возвращают строковый sql запрос
class QuerryBuilder {
    /**
     * Ключевое слово для WHERE подвыражения
     */
    static WHERE = "WHERE";
    /**
     * Ключевое слово для GROUP BY подвыражения
     */
    static GROUP_BY = "GROUP BY";
    /**
     * Ключевое слово для ORDER BY подвыражения
     */
    static ORDER_BY = "ORDER BY";
    /**
     * Ключевое слово для LIMIT подвыражения
     */
    static LIMIT = "LIMIT";

    /**
     * Логическое И в SQL 
     */
    static AND = "AND";
    /**
     * Логическое ИЛИ в SQL 
     */
    static OR = "OR";
    /**
     * Логическое НЕ в SQL 
     */
    static NOT = "NOT";
    /**
     * DESC оператор SQL 
     */
    static DESC = "DESC";

    /**
     * Cоздает шаблон равенства колонки со значением
     * @param {string} columnName - Название колонки
     * @returns Строка шаблон вида "columnName = $"
     */
    static equals(columnName) {
        return `${columnName} = $`;
    }
    /**
     * Создает шаблон, по которому значение в колонке больше предложенного значения
     * @param {string} columnName - Название колонки
     * @returns Строка шаблон вида "columnName > $"
     */
    static bigger(columnName) {
        return `${columnName} > $`;
    }
    /**
     * Создает шаблон, по которому значение в колонке меньше предложенного значения
     * @param {string} columnName - Название колонки
     * @returns Строка шаблон вида "columnName < $"
     */
    static smaller(columnName) {
        return `${columnName} < $`;
    }
    /**
     * Создает шаблон, по которому значение в колонке не равно предложенному значению
     * @param {string} columnName - Название колонки
     * @returns Строка шаблон вида "columnName != $"
     */
    static notEquals(columnName) {
        return `${columnName} != $`;
    }
    /**
     * Создает шаблон, по которому значение в колонке меньше либо равно предложенного значения
     * @param {string} columnName - Название колонки
     * @returns Строка шаблон вида "columnName <= $"
     */
    static notBigger(columnName) {
        return `${columnName} <= $`;
    }
    /**
     * Создает шаблон, по которому значение в колонке больше либо равно предложенного значения
     * @param {string} columnName - Название колонки
     * @returns Строка шаблон вида "columnName >= $"
     */
    static notSmaller(columnName) {
        return `${columnName} >= $`;
    }
    static like(columnName) {
        return `${columnName} LIKE $`;
    }

    /**
     * Создает строку, содержащую INSERT SQL запрос
     * @param {string} tableName - Имя таблицы 
     * @param {string[]} columnNames - Имя колонок
     * @returns Строка с INSERT запросом
     */
    static makeInsertQuery(tableName, columnNames) {
        let sqlQuery = `INSERT INTO ${tableName} (`;
        sqlQuery += columnNames.toString().replaceAll(",", ", ");
        sqlQuery += `) VALUES (`;
        for (let i = 1; i <= columnNames.length; i++)
            sqlQuery += `$${i}${i == columnNames.length ? ")" : ", "}`;
        return sqlQuery;
    }

    /**
     * Расширеный генератор INSERT запроса
     * @param {string} tableName 
     * @param {string[]} columnNames 
     * @param {string} whereExpression 
     * @returns 
     */
    static makeExtendedInsertQuery(tableName, columnNames, whereExpression) {
        return QuerryBuilder.makeInsertQuery(tableName, columnNames) + whereExpression;
    }
    /**
     * Создает строку, содержащую INSERT SQL запрос
     * @param {string} tableName 
     * @param {{
     * columnNames: string[]
     * whereExpression: string
     * groupByExpression: string
     * orderByExpression: string
     * limit: string
     * }} args - аргументы запроса
     * @returns 
     */
    static makeSelectQuery(tableName, args = {
        columnNames: this.columnNames,
        whereExpression: this.whereExpression || null,
        groupByExpression: this.groupByExpression || null,
        orderByExpression: this.orderByExpression || null,
        limit: this.limit || null
    }) {
        let sqlQuery = `SELECT `;
        sqlQuery += args.columnNames === null || args.columnNames === undefined ? "*" : args.columnNames.toString().replaceAll(",", ", ");
        sqlQuery += ` FROM ${tableName}`;
        sqlQuery += args.whereExpression != null ? " " + args.whereExpression : "";
        sqlQuery += args.groupByExpression != null ? " " + args.groupByExpression : "";
        sqlQuery += args.orderByExpression != null ? " " + args.orderByExpression : "";
        sqlQuery += args.limit != null ? " " + args.limit : "";
        let i = 1;
        for (let index = sqlQuery.indexOf("$"); index != -1; index = sqlQuery.indexOf("$", index + 2))
            sqlQuery = sqlQuery.slice(0, index + 1) + (i++) + sqlQuery.slice(index + 1);
        return sqlQuery;
    }

    /**
     * Создает Update SQL запрос в виде строки
     * @param {string} tableName - имя таблицы
     * @param {string[]} columnNames - имена колонок для изменения
     * @param {string | undefined} whereExpression - дополнительное условие для изменения
     * @returns строку c SQL запросом
     */
    static makeUpdateQuery(tableName, columnNames, whereExpression) {
        let sqlQuery = `UPDATE ${tableName} SET `;
        let index = 0
        for (; index < columnNames.length;) {
            if (index != 0)
                sqlQuery += ", ";
            sqlQuery += `${columnNames[index]} = $${++index}`;

        }
        if (whereExpression) {
            for (let varIndex = whereExpression.indexOf('$'); varIndex != -1; varIndex = whereExpression.indexOf('$', varIndex + 1))
                whereExpression = whereExpression.slice(0, varIndex + 1) + (++index) + whereExpression.slice(varIndex + 1);
            sqlQuery += ` ${whereExpression}`;
        }
        return sqlQuery;
    }
    /**
     * Создает DELETE SQL запрос в виде строки
     * @param {string} tableName - имя таблицы
     * @param {string | undefined} whereExpression - условие для удаления
     * @returns строку с данным SQL запросом
     */
    static makeDeleteQuery(tableName, whereExpression) {
        let count = 1;
        let sqlQuery = `DELETE FROM ${tableName}${whereExpression ? ` ${whereExpression}` : ""}`.replace('$', match => {
            return `$${count++}`;
        });
        return sqlQuery;
    }
    /**
     * Создает подвыражение для уточнения запросов
     * @param {string} subexpressionKeyWord - Ключевое слово подзапроса
     * @param {string} logicExpression - Логическое выражение, приминимое в данном подвыражение
     * @returns Строка, содержащая подвыражение
     */
    static makeSubexpression(subexpressionKeyWord, logicExpression) {
        return `${subexpressionKeyWord} ${logicExpression}`;
    }

    /**
     * Создает логическое выражение
     * @param {string} logicOperator - Логический оператор
     * @param {string} firstExpressionPart - Первая часть логического выражения
     * @param {string} secondExpressionPart - Вторая часть логического выражения
     * @returns Строка с логическим выражением
     */
    static makeLogicExpression(logicOperator, firstExpressionPart, secondExpressionPart) {
        return `${firstExpressionPart != null || firstExpressionPart != undefined ? firstExpressionPart + " " : ""}${logicOperator}${secondExpressionPart != null || secondExpressionPart != undefined ? " " + secondExpressionPart : ""}`;
    }

}
module.exports = QuerryBuilder;