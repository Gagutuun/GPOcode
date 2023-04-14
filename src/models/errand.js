// Модель поручения
const db = require('../config/dbConfig');
const { makeInsertQuery } = require('../utils/queryBuilder');

const tableName = 'public."Errand"';
const columnNames = {
    id: 'id',
    id_responsible: 'id_responsible', // Данные для вставки: idResponsible
    text_errand: 'text_errand', // Данные для вставки: errandParsedData.errandText
    constantly: 'constantly', // Ставится, если errandParsedData.deadline = "постоянно";
    short_report_doc: 'short_report_doc', // Заполняется позже
    scheduled_due_date: 'scheduled_due_date', // Ставится, если errandParsedData.deadline - дата. 
    actual_date: 'actual_date', // Ставится позже
    status: 'status', // Я хз че это
    id_protocol: 'id_protocol' // Нужно получить из запроса к протоколу
}

class Errand {
    static addNewErrand(errandParsedData) {
        // Выполняем запрос к таблице сотрудников на получение id ответсенного.
        const idResponsible = 1;
        db.query(
            
        )
        // Создаем запрос на добавление новой записи в таблицу Errand
    }
}

module.exports = Errand;