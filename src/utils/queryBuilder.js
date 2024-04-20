// Все функции этого модуля Возвращают строковый sql запрос
class QueryBuilder {
    constructor(rawQuery, values) {
        this._stringQuery = rawQuery;
        this._dbPool = require('../config/dbConfig');
        this._values = values;
    }

    /**
     * Создает SELECT запрос
     * @param {string[]} columns - массив названий столбцов
     * @param {string} table - имя таблицы
     * @returns Подготовленный SQL запрос
     */
    static select(columns, table) {
        return new QueryBuilder(
            `SELECT ${
                (columns.length > 0)
                    ? columns
                    : '*'} FROM ${table}`,
            []);
    }

    /**
     * Создает INSERT запрос
     * @param {string} table - имя таблицы
     * @param {string[]} columns - массив названий столбцов
     * @param {*[]} values - массив значений
     * @returns Подготовленный SQL запрос
     */
    static insert(table, columns, values) {
        return new QueryBuilder(
            `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${
                Array.from({length: values.length}, (_, i) => `$${i + 1}`).join(", ")
            })`, values);
    }

    /**
     * Создает UPDATE запрос
     * @param {string} table - имя таблицы
     * @param {string[]} columns - массив названий столбцов
     * @param {*[]} values - массив значений
     * @returns Подготовленный SQL запрос
     */
    static update(table, columns, values) {
        return new QueryBuilder(
            `UPDATE ${table} SET ${
                columns
                    .map((column, i) => `${column} = $${i + 1}`)
                    .join(", ")
            }`, values
        )
    }

    /**
     * Добавляет условие WHERE
     * @param {string} condition - условие 
     * @param {*[]} values - массив значений, которые должны быть вставлены вместо '?'
     * @returns SQL запрос с условием WHERE
     */
    where(condition, values) {
        if (values !== undefined) {
            this._addValues(values);
            condition = this._replaceToApiStrings(condition);
        }
        this._stringQuery += ` WHERE ${condition}`;
        return this
    }

    /**
     * Добавляет значения в общий массив
     * @param {*[]} values - значения для добавления
     */
    _addValues(values) {
        values.forEach(element => this._values.push(element));
    }

    /**
     * Заменяет ? на $n
     * @param {string} condition - условие
     * @returns Строку с замененными значениями
     */
    _replaceToApiStrings(condition) {
        let count = this._getLastCount();
        let index;
        while ((index = condition.indexOf('?')) !== -1) {
            condition = condition.replace('?', `$${++count}`);
        }
        return condition;
    }

    /**
     * Находит последний вставленный $
     * @returns число после последнего $
     */
    _getLastCount() {
        const lastInsertSubstring = this._lastInsertSubstring();
        return lastInsertSubstring !== null
            ? parseInt(lastInsertSubstring.substring(1))
            : 0;
    }

    /**
     * Находит последнее вхождение строки вида /\$\d+/
     * @returns Найденную подстроку или null
     */
    _lastInsertSubstring() {
        let matches = this._stringQuery.match(/\$\d+/gm);
        if (matches) {
            return matches[0];
        }
        return null;
    }

    /**
     * Добавляет GROUP BY в запрос
     * @param {string} condition - условие
     * @param {*[]} values - массив значений, которые должны быть вставлены вместо '?'
     * @returns SQL запрос с условием GROUP BY
     */
    groupBy(condition, values) {
        if (values !== undefined) {
            this._addValues(values);
            condition = this._replaceToApiStrings(condition);
        }
        this._stringQuery += ` GROUP BY ${condition}`;
        return this;
    }

    /**
     * Добавляет ORDER BY в запрос
     * @param {string} condition - условие
     * @param {*[]} values - массив значений, которые должны быть вставлены вместо '?'
     * @returns SQL запрос с условием ORDER BY
     */
    orderBy(condition, values) {
        if (values !== undefined) {
            this._addValues(values);
            condition = this._replaceToApiStrings(condition);
        }
        this._stringQuery += ` ORDER BY ${condition}`;
        return this;
    }

    /**
     * Выполняет построенный SQL запрос
     * @returns Промис на выполнение запроса
     */
    exec() {
        return new Promise((resolve, reject) => {
            this._dbPool.query(
                this._stringQuery,
                this._values,
                (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (result.rowCount > 0) {
                    resolve(result.rows);
                    return;
                }
                resolve(null);
            })
        })
    }

}
module.exports = QueryBuilder;