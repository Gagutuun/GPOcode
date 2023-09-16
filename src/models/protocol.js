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
                    new Array(this.columnNames.id),
                    this.tableName,
                    null,
                    null,
                    // `${this.columnNames.id} ${queryBuilder.DESC}`
                    queryBuilder.makeSubexpression(
                        queryBuilder.ORDER_BY,
                        this.columnNames.id,
                        queryBuilder.DESC
                    ),
                    queryBuilder.makeSubexpression(
                        queryBuilder.LIMIT,
                        1
                    )
                ),
                [],
                (error, result) => {
                    if (error)
                        reject(error);
                    else if (result.rows.length > 0)
                        resolve(result.rows[0].id);
                    else
                        resolve(null);
                }
            )
        })
    }

    static getProtocolPathByID(id) {
        return new Promise((resolve, reject) => {
            db.query(
                queryBuilder.makeSelectQuery(
                    new Array(this.columnNames.file_protocol_doc),
                    this.tableName,
                    queryBuilder.makeSubexpression(`${this.columnNames.id} = $1`)
                ),
                [id],
                (error, result) => {
                    if (error)
                        reject(error);
                    if (result.rows.length > 0)
                        resolve(result.rows[0].file_protocol_doc);
                    else
                        resolve(null);
                }
            )
        })
    }
}

module.exports = Protocol;