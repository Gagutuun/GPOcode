const queryBuilder = require('../utils/queryBuilder');

/**
 * Модель поручения
 */
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
    static complitedStatus = "Завершено";

    /**
     * Добавляет новое поручение в базу данных
     * @param {string} errandText - Текст поручения
     * @param {string} deadline - Дата или "постоянно"
     * @param {int} idProtocol - ID протокола
     * @returns Промис выполнения запроса
     */
    static addNewErrand(errandText, deadline, idProtocol) {
        return queryBuilder.insert(
                this.tableName,
                [
                    this.columnNames.constantly,
                    this.columnNames.id_protocol,
                    this.columnNames.scheduled_due_date,
                    this.columnNames.text_errand,
                    this.columnNames.status
                ],
                deadline === "постоянно"
                    ? [true, idProtocol, null, errandText, this.activeStatus]
                    : [false, idProtocol, deadline, errandText, this.activeStatus]
            ).exec();
    }
    /**
     * Возвращает ID последнего добавленного поручения
     * @returns Промис выполнения запроса
     */
    static getLastAddedErrandId() {
        return queryBuilder.select(
                [this.columnNames.id],
                this.tableName
            ).orderBy(`${this.columnNames.id} DESC`)
            .limit(1)
            .exec();
    }
    /**
     * Возвращает полную информацию о поручении по его id
     * @param {int} idErrand - ID поручения
     * @returns Промис выполнения запроса
     */
    static getErrandByID(idErrand) {
        return queryBuilder.select(
                [],
                this.tableName
            ).where(`${this.columnNames.id} = ${idErrand}`)
            .exec();
    }
    /**
     * Возвращает массив поручений с информацией: id, text_errand - по id протокола
     * @param {int} idProtocol - ID протокола
     * @returns Массив ID и текстов поручений
     */
    static getAllErrandsOfProtocol(idProtocol) {
        return queryBuilder.select(
                [this.columnNames.id, this.columnNames.text_errand],
                this.tableName
            ).where(`${this.columnNames.id_protocol} = ${idProtocol}`)
            .exec();
    }
    /**
     * Возвращает все завершенные поручения
     * @returns Промис выполнения запроса
     */
    static getFinishedErrands() {
        return queryBuilder.select(
                    [],
                    this.tableName
            ).where(`${this.columnNames.status} = '${this.complitedStatus}'`)
            .exec();
    }
    /**
     * Возвращает все поручения
     * @returns Промис выполнения запроса
     */
    static getAllErrands() {
        return queryBuilder.select(
                [],
                this.tableName
            ).exec();
    }
    /**
     * Меняет статус поручения
     * @param {number} idErrand - ID поручения
     * @param {string} status - Статус
     * @returns Промис выполнения запроса
     */
    static changeStatus(idErrand, status) {
        return queryBuilder.update(
                this.tableName,
                [
                    this.columnNames.status
                ],
                [
                    status
                ]
            ).where(`${this.columnNames.id} = ${idErrand}`)
            .exec();
    }
}

module.exports = Errand;

