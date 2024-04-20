const queryBuilder = require('../utils/queryBuilder');

/**
 * Модель протокола
 */
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
     * @param {Date} protocolDate - Дата протокола
     * @param {number} protocolNumber - Номер протокола
     * @returns Промис выполнения запроса
     */
    static addNewProtocol(protocolPath, protocolDate, protocolNumber) {
        return queryBuilder.insert(
            this.tableName,
            [
                this.columnNames.file_protocol_doc,
                this.columnNames.protocol_date,
                this.columnNames.protocol_number
            ],
            [
                protocolPath,
                protocolDate,
                protocolNumber
            ]
        ).exec();
    }
    /**
     * Возвращает ID последнего добавленного протокола
     * @returns ID протокола
     */
    static getLastProtocolId() {
        return queryBuilder.select(
                [
                    this.columnNames.id
                ],
                this.tableName
            ).orderBy(`${this.columnNames.id} DESC`)
            .limit(1)
            .exec();
    }
    /**
     * Возвращает путь до протокла по его ID
     * @param {int} id - ID искомого протокола 
     * @returns Путь до протокола
     */
    static getProtocolPathByID(id) {
        return queryBuilder.select(
                [
                    this.columnNames.file_protocol_doc
                ],
                this.tableName
            ).where(`${this.columnNames.id} = ${id}`)
            .exec();
    }
    /**
     * Удаляет запись о протоколе из таблицы по его id
     * @param {int} protocolID - id протокола в таблице
     * @returns Promise на удаление записи из таблицы
     */
    static deleteProtocolByID(protocolID) {
        return queryBuilder.delete(this.tableName)
                            .where(`${this.columnNames.id} = ${protocolID}`)
                            .exec();
    }
    /**
     * Возвращает ID протокола по его номеру и дате
     * @param {number} protocolNumber - Номер протокола
     * @param {Date} protocolDate - Дата протокола
     * @returns Промис на выполнение запроса
     */
    static getProtocolID(protocolNumber, protocolDate) {
        return queryBuilder.select(
                [
                    this.columnNames.id
                ],
                this.tableName
            ).where(`${this.columnNames.protocol_number} = '${protocolNumber}' AND ${this.columnNames.protocol_date} = '${protocolDate}'`)
            .exec();
    }
    /**
     * Возвращает путь до генерального отчёта по ID протокола, с которым он связан 
     * @param {number} protocolID - ID протокола
     * @returns Промис на выполнение запроса
     */
    static getReportPathByProtocolID(protocolID) {
        return queryBuilder.select(
                [
                    this.columnNames.general_report_file_doc
                ],
                this.tableName
            ).where(`${this.columnNames.id} = ${protocolID}`)
            .exec();
    }

}

module.exports = Protocol;