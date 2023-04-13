const db = require('../config/dbConfig');
const { makeInsertQuery } = require('../utils/queryBuilder');

const tableName = 'public."Protocol"';
const columnNames = {
    id: "id",
    protocol_date: "protocol_date",
    file_protocol_doc: "file_protocol_doc",
    protocol_number: "protocol_number",
    general_report_file_doc: "general_report_file_doc"
}

class Protocol {
    //Добавляет новый проток в бд
    static addNewProtocol(protocolPath/*, protocolDate, protocolNumber*/) {
        db.query(
            makeInsertQuery(tableName, new Array(columnNames.file_protocol_doc), 1),
            [protocolPath],
            (err, res) => {
                if (err)
                    console.error(err);
                else
                    console.log("Добавлен новый протокол");
            }
        )
    }
}

module.exports = Protocol;