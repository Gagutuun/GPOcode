const db = require('../config/dbConfig');

class Protocol {
    static addNewProtocol(protocolPath/*, protocolDate, protocolNumber*/) {
        db.query(
            'INSERT INTO public."Protocol" (file_protocol_doc) VALUES ($1)',
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
}

module.exports = Protocol;