// Все функции этого модуля Возвращают строковый sql запрос
class QueryBuilder {
    constructor(rawQuery, values) {
        this.stringQuery = rawQuery;
        this._dbPool = require('../config/dbConfig');
        this.values = values;
    }

    static select(columns, table) {
        return new QueryBuilder(
            `SELECT ${
                (columns.length > 0)
                    ? columns
                    : '*'} FROM ${table}`,
            []);
    }

    static insert(table, columns, values) {
        return new QueryBuilder(
            `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${
                Array.from({length: values.length}, (_, i) => `$${i + 1}`).join(", ")
            })`, values);
    }

    where(condition) {
        this.stringQuery += ` WHERE ${condition}`;
        return this;
    }

    groupBy(condition) {
        this.stringQuery += ` GROUP BY ${condition}`;
        return this;
    }

    /**
     * 
     * @param {*} condition 
     * @returns 
     */
    orderBy(condition) {
        this.stringQuery += ` ORDER BY ${condition}`;
        return this;
    }

    /**
     * Выполняет построенный SQL запрос
     * @returns Промис на выполнение запроса
     */
    exec() {
        return new Promise((resolve, reject) => {
            this._dbPool.query(
                this.stringQuery,
                this.values,
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