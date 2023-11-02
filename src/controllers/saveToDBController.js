const asyncHandler = require('express-async-handler');
const Protocol = require('../models/protocol');
const Errand = require('../models/errand');
const Employee = require('../models/employee');
const ErrandEmployee = require('../models/errandEmployee');

module.exports = asyncHandler(async (req, res) => {
    const protocolDate = req.body.protocolDate; // Получите дату протокола из формы
    const protocolNumber = req.body.protocolNumber; // Получите номер протокола из формы
    const errandData = req.body.errandData; // Получите данные поручений, которые были отредактированы на странице предпросмотра
    
    // Получаем id, последнего добавленного Протокола
    const idProtocol = await Protocol.getLastProtocolId();

    // Идем по каждому элементу массива, отправляя запрос к бд на добавление новых записей в Errand
    req.errandArray.forEach(errand => {
        // Т.к. сейчас непонятно кому давать поручение, assignID = 1
        // const assignID = 1;
        let assignID = [];
        errand.asgnName.forEach(name => {
            // TODO доделать логику
            // TODO остановился на определении чего я пушу в массив (ЗГД или ФИО)
            Employee.findByName(name)
                .then(ids => {
                    ids.forEach(id => {
                        assignID.push(id.id);
                    });
                })
                .catch(error => {
                    console.error(error);
                })
        });
        Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol);
        const lastAddedErrandId = Errand.getLastAddedErrandId();
        assignID.forEach(id => {
            ErrandEmployee.addRow(lastAddedErrandId, id);
        })
    });

    // res.render('PAGE_NAME');
})