// Модель поручения
const db = require('../config/dbConfig');

const tableName = 'public."Errand"';
const columnNames = {
    id: 'id',
    id_responsible: 'id_responsible',
    text_errand: 'text_errand',
    constantly: 'constantly',
    short_report_doc: 'short_report_doc',
    scheduled_due_date: 'scheduled_due_date',
    actual_date: 'actual_date',
    status: 'status',
    id_protocol: 'id_protocol'
}

class Errand {
    static addNewErrand(errandParsedData) {
        // Выполняем запрос к таблице сотрудников на получение id ответсенного.
        // Создаем запрос на добавление новой записи в таблицу Errand
    }
}

module.exports = Errand;