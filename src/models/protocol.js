const db = require('../config/dbConfig');
const queryBuilder = require('../utils/queryBuilder');

class Protocol {
    static tableName = 'public."Protocol"';
    static columnNames = {
        id: "id",
        protocol_date: "protocol_date",
        file_protocol_doc: "file_protocol_doc",
        protocol_number: "protocol_number",
        general_report_file_doc: "general_report_file_doc"
    };
    //Добавляет новый проток в бд
    static addNewProtocol(protocolPath/*, protocolDate, protocolNumber*/) {
        db.query(
            queryBuilder.makeInsertQuery(this.tableName, new Array(this.columnNames.file_protocol_doc), 1),
            [protocolPath],
            (err, res) => {
                if (err)
                    console.error(err);
                else
                    console.log("Добавлен новый протокол");
            }
        )
    }

    static getLast

    // static getProtocolId()
}

module.exports = Protocol;