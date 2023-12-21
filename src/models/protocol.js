const db = require('../config/dbConfig');
const queryBuilder = require('../utils/queryBuilder');

class Protocol {
    /**
     * Имя таблицы в базе данных
     */
    static tableName = 'public."Protocol"';
    /**
     * Имена колонок в данной таблице
     */
    static columnNames = {
        id: "id",
        protocol_date: "protocol_date",
        file_protocol_doc: "file_protocol_doc",
        protocol_number: "protocol_number",
        general_report_file_doc: "general_report_file_doc"
    };

    /**
     * Добавляет новый протокол в бд
     * @param {string} protocolPath - Путь до протокола 
     */
    static addNewProtocol(protocolPath, protocolDate, protocolNumber) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeInsertQuery(
                    this.tableName,
                    [
                        this.columnNames.file_protocol_doc,
                        this.columnNames.protocol_date,
                        this.columnNames.protocol_number
                    ]
                ),
                [protocolPath, protocolDate, protocolNumber],
                (err, res) => {
                    if (err)
                        reject(err);
                    else if (res.rowCount > 0)
                        resolve();
                    else
                        reject();
                }
            )
        })
    }

    /**
     * Возвращает ID последнего добавленного протокола
     * @returns ID протокола
     */
    static getLastProtocolId() {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    {
                        columnNames: new Array(this.columnNames.id),
                        orderByExpression: queryBuilder.makeSubexpression(
                            queryBuilder.ORDER_BY,
                            queryBuilder.makeLogicExpression(
                                queryBuilder.DESC,
                                this.columnNames.id
                            )
                        ),
                        limit: queryBuilder.makeSubexpression(
                            queryBuilder.LIMIT,
                            "1"
                        )
                    }
                ),
                [],
                (error, result) => {
                    if (error) {
                        console.error(`[ERROR] ${error}`)
                        reject(error);
                    }
                    else if (result.rowCount > 0)
                        resolve(result.rows[0].id);
                    else
                        resolve(null);
                }
            )
        })
    }

    /**
     * Возвращает путь до протокла по его ID
     * @param {int} id - ID искомого протокола 
     * @returns Путь до протокола
     */
    static getProtocolPathByID(id) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    {
                        columnNames: new Array(this.columnNames.file_protocol_doc),
                        whereExpression: queryBuilder.makeSubexpression(
                            queryBuilder.WHERE,
                            queryBuilder.equals(this.columnNames.id)
                        )
                    }
                ),
                [id],
                (error, result) => {
                    if (error)
                        reject(error);
                    else if (result.rowCount > 0)
                        resolve(result.rows[0].file_protocol_doc);
                    else
                        resolve(null);
                }
            )
        })
    }
    /**
     * Удаляет запись о протоколе из таблицы по его id
     * @param {int} protocolID - id протокола в таблице
     * @returns Promise на удаление записи из таблицы
     */
    static deleteProtocolByID(protocolID) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeDeleteQuery(
                    this.tableName,
                    queryBuilder.makeSubexpression(
                        queryBuilder.WHERE,
                        queryBuilder.equals(this.columnNames.id)
                    )
                ),
                [protocolID],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (result.rowCount > 0) {
                        resolve("Запрос успешно выполнен!");
                        return;
                    }
                    reject("Не известная ошибка!");
                    return;
                }
            )
        })
    }

    static getProtocolID(protocolNumber, protocolDate) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    {
                        columnNames: [this.columnNames.id],
                        whereExpression: queryBuilder.makeSubexpression(
                            queryBuilder.WHERE,
                            queryBuilder.makeLogicExpression(
                                queryBuilder.AND,
                                queryBuilder.equals(this.columnNames.protocol_number),
                                queryBuilder.equals(this.columnNames.protocol_date)
                            )
                        )
                    }
                ),
                [protocolNumber, protocolDate],
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (result.rowCount > 0) {
                        resolve(result.rows[0].id);
                        return;
                    }
                    reject("Неизвестная ошибка!");
                }
            )
        })
    }

}

module.exports = Protocol;