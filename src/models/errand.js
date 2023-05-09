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

    // Добавляем новое поручение
    static addNewErrand(errandText, deadline, idProtocol, idResponsible) {
        // Выполняем запрос к таблице сотрудников на получение id ответсенного.
        // const idResponsible = 1; // запрос к users
        if (deadline === "постоянно")
            db.query(
                queryBuilder.makeInsertQuery(
                    this.tableName,
                    new Array(
                        this.columnNames.constantly,
                        this.columnNames.id_protocol,
                        this.columnNames.id_responsible,
                        this.columnNames.text_errand
                    ),
                    4
                ),
                [true, idProtocol, idResponsible, errandText],
                (error, result) => {
                    if (error)
                        console.error(error);
                }
            )
        else
            db.query(
                queryBuilder.makeInsertQuery(
                    this.tableName,
                    new Array(
                        this.columnNames.constantly,
                        this.columnNames.id_protocol,
                        this.columnNames.id_responsible,
                        this.columnNames.scheduled_due_date,
                        this.columnNames.text_errand
                    ),
                    5
                ),
                [false, idProtocol, idResponsible, deadline, errandText],
                (error, result) => {
                    if (error)
                        console.log(error);
                }
            )
    }
    
    // Возвращает полную информацию о поручении по его id
    static getErrandByID(idErrand) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    null,
                    this.tableName,
                    queryBuilder.makeSubexpression(
                        queryBuilder.WHERE,
                        "id = $1"
                    )
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

    // Возвращает массив поручений с информацией: id, text_errand - по id протокола
    static getAllErrandsOfPtoorocol(idProtocol) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    new Array(
                        this.columnNames.id,
                        this.columnNames.text_errand
                    ),
                    this.tableName,
                    queryBuilder.makeSubexpression(
                        queryBuilder.WHERE,
                        queryBuilder.equals(this.columnNames.id_protocol)
                    )
                ),[idProtocol],
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
}

module.exports = Errand;