// Все функции этого модуля Возвращают строковый sql запрос
class QueryBuilder {
    constructor(rawQuery) {
        this.stringQuery = rawQuery;
        this._dbPool = require('../config/dbConfig');
    }

    static select(columns, table) {
        return new QueryBuilder(`SELECT ${(columns == undefined || columns == null || columns.length > 0) ? columns : '*'} FROM ${table}`);
    }

    static selectDistinct(columns, table) {
        return new QueryBuilder(`SELECT DISTINCT ${columns.length > 0 ? columns : '*'} FROM ${table}`);
    }

    where(condition) {
        this.stringQuery += ` WHERE ${condition}`;
        return this;
    }

    groupBy(condition) {
        this.stringQuery += ` GROUP BY ${condition}`;
        return this;
    }

    orderBy(condition) {
        this.stringQuery += ` ORDER BY ${condition}`;
        return this;
    }

    exec() {
        return new Promise((resolve, reject) => {
            this._dbPool.query(
                this.stringQuery,
                [],
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

const protocolModel = require('../models/protocol');

QueryBuilder.select(
    protocolModel.columnNames.id,
    protocolModel.tableName)
    // .orderBy(protocolModel.columnNames.id)
    .exec()
    .then(res => {
        console.log(res);
        return;
    })
    .catch(err => {
        console.error(err);
        return;
    });

return;