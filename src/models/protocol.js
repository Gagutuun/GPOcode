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

    static getLastProtocolId() {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    this.columnNames.id,
                    this.tableName,
                    null,
                    null,
                    queryBuilder.makeSubexpression(`${this.columnNames.id} ${queryBuilder.DESC}`),
                    1
                ),
                [],
                (error, result) => {
                    if (error)
                        reject(error);
                    else if (result.rows.length > 0)
                        resolve(result.rows[0]);
                    else
                        resolve(null);
                }
            )
        })
    }

    // static getProtocolId()
}

module.exports = Protocol;