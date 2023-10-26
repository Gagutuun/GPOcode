const asyncHandler = require('express-async-handler');
const Protocol = require('../models/protocol');
const Errand = require('../models/errand');

module.exports = asyncHandler(async (req, res) => {
    // Получаем id, последнего добавленного Протокола
    const idProtocol = await Protocol.getLastProtocolId();

    // Идем по каждому элементу массива, отправляя запрос к бд на добавление новых записей в Errand
    req.errandArray.forEach(errand => {
        // Т.к. сейчас непонятно кому давать поручение, assignID = 1
        const assignID = 1;
        Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol, assignID);
    });

    // res.render('PAGE_NAME');
})