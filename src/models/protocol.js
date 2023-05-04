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
                if (err){
                    console.error(err);
                }
                else
                    console.log("Добавлен новый протокол");
            }
        )
    }

    static getProtocolId(protocolNumber, protocolDate, callback) {
        const query = `SELECT ${columnNames.id} FROM ${tableName} WHERE 
                        ${columnNames.protocol_number}=$1 AND 
                        ${columnNames.protocol_date}=$2`;
        db.query(query, [protocolNumber, protocolDate], (err, res) => {
            if (err) {
                console.error(err);
                return callback(null);
            } else {
                if (res.rows.length === 0) {
                    console.log("No protocol found");
                    return callback(null);
                } else {
                    console.log(`Found protocol with id: ${res.rows[0][columnNames.id]}`);
                    return callback(res.rows[0][columnNames.id]);
                }
            }
        });
    }
    static getProtocolPath(protocolNumber, protocolDate, callback) {
        const query = `SELECT ${columnNames.file_protocol_doc} FROM ${tableName} WHERE ${columnNames.protocol_number}=$1 AND ${columnNames.protocol_date}=$2`;
        db.query(query, [protocolNumber, protocolDate], (err, res) => {
            if (err) {
                console.error(err);
                return callback(null);
            } else {
                if (res.rows.length === 0) {
                    console.log("No protocol found");
                    return callback(null);
                } else {
                    return callback(res.rows[0][columnNames.file_protocol_doc]);
                }
            }
        });
    }
    static getLastProtocolPath(callback) {
        const query = `SELECT ${columnNames.file_protocol_doc} FROM ${tableName} ORDER BY ${columnNames.created_at} DESC LIMIT 1`;
        db.query(query, (err, res) => {
            if (err) {
                console.error(err);
                return callback(null);
            } else {
                if (res.rows.length === 0) {
                    console.log("No protocols found");
                    return callback(null);
                } else {
                    return callback(res.rows[0][columnNames.file_protocol_doc]);
                }
            }
        });
    }
    
    
}

module.exports = Protocol;