// Модель поручения
const db = require('../config/dbConfig');
const queryBuilder = require('../utils/queryBuilder');

class Errand {
    static tableName = 'public."Errand"';
    static columnNames = {
        id: 'id',
        id_responsible: 'id_responsible', // Данные для вставки: idResponsible
        text_errand: 'text_errand', // Данные для вставки: errandParsedData.errandText
        constantly: 'constantly', // Ставится, если errandParsedData.deadline = "постоянно";
        short_report_doc: 'short_report_doc', // Заполняется позже
        scheduled_due_date: 'scheduled_due_date', // Ставится, если errandParsedData.deadline - дата. 
        actual_date: 'actual_date', // Ставится позже
        status: 'status', // Я хз че это
        id_protocol: 'id_protocol' // Нужно получить из запроса к протоколу
    };

    static activeStatus = "Активный";

    /**
     * Добавляет новое поручение в базу данных
     * @param {string} errandText 
     * @param {string} deadline 
     * @param {int} idProtocol 
     */
    static addNewErrand(errandText, deadline, idProtocol) {
        return new Promise(async (resolve, reject) => {
            db.query(
                queryBuilder.makeInsertQuery(
                    this.tableName,
                    new Array(
                        this.columnNames.constantly,
                        this.columnNames.id_protocol,
                        this.columnNames.scheduled_due_date,
                        this.columnNames.text_errand,
                        this.columnNames.status
                    )
                ),
                deadline === "постоянно"
                    ? [true, idProtocol, null, errandText, this.activeStatus]
                    : [false, idProtocol, deadline, errandText, this.activeStatus],
                async (error) => {
                    if (error) {
                            reject(error);
                            return;
                    }
                }
            )
        })
    }

    static getLastAddedErrandId() {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    {
                        columnNames: [this.columnNames.id],
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
                        reject(error);
                        return;
                    }
                    if (result.rowCount > 0) {
                        resolve(result.rows[0].id);
                        return;
                    }
                    reject("Unknown error");
                }
            );
        })
    }

    /**
     * Возвращает полную информацию о поручении по его id
     * @param {int} idErrand - ID поручения
     * @returns 
     */
    static getErrandByID(idErrand) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    {
                        whereExpression: queryBuilder.makeSubexpression(
                            queryBuilder.WHERE,
                            queryBuilder.equals(this.columnNames.id)
                        )
                    }
                ),
                [idErrand],
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else if (res.rowCount > 0) {
                        resolve(res.rows[0]);
                    } else {
                        resolve(null);
                    }
                }
            )
        })
    }

    /**
     * Возвращает массив поручений с информацией: id, text_errand - по id протокола
     * @param {int} idProtocol - ID протокола
     * @returns Массив ID и текстов поручений
     */
    static getAllErrandsOfProtocol(idProtocol) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    {
                        columnNames: new Array(
                            this.columnNames.id,
                            this.columnNames.text_errand
                        ),
                        whereExpression: queryBuilder.makeSubexpression(
                            queryBuilder.WHERE,
                            queryBuilder.equals(this.columnNames.id_protocol)
                        )
                    }
                ),
                [idProtocol],
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else if (res.rowCount > 0) {
                        resolve(res.rows);
                    } else {
                        resolve(null);
                    }
                }
            )
        })
    }

    // Возвращает массив поручение, к которым приложили отчет
    // P.S. Как оказалось, поле status это string, а не boolean 😥
    static getFinishedErrands() {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    {
                        whereExpression: queryBuilder.makeSubexpression(
                            queryBuilder.WHERE,
                            queryBuilder.equals(this.columnNames.status)
                        )
                    }
                ),
                ['done'],
                (err, res) => {
                    if (err)
                        reject(err);
                    else if (res.rowCount > 0) {
                        resolve(res.rows);
                    }
                    else
                        resolve(null);
                }
            );
        });
    }

    // Возвращает все поручения
    static getAllErrands() {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName
                ),
                [],
                (err, res) => {
                    if (err)
                        reject(err);
                    else if (res.rowCount > 0)
                        resolve(res.rows);
                    else
                        resolve(null);
                }
            );
        });
    }
}

module.exports = Errand;

