const asyncHandler = require('express-async-handler');
const Protocol = require('../models/protocol');
const Errand = require('../models/errand');
const Employee = require('../models/employee');
const ErrandEmployee = require('../models/errandEmployee');

const ZGD = "заместители генерального директора";

exports.saveToDB = asyncHandler(async (req, res) => {
    try {
        // Получаем id последнего добавленного Протокола
        const idProtocol = await Protocol.getLastProtocolId();
        console.log('Начало сохранения в базу данных');

        const assignIDsPromises = [];

        // Идем по каждому элементу массива, отправляя запрос к бд на добавление новых записей в Errand
        for (const errand of req.body.errandArray) {
            const assignID = [];
            
            for (const names of errand.asgnName) {
                // TODO: Доделайте логику определения, что является ЗГД или ФИО

                for (const name of names) {
                    console.log(name);
                    const idPromise = Employee.findByName(parseName(name));
                    assignIDsPromises.push(idPromise);
                }
            }

            const assignIDs = await Promise.all(assignIDsPromises);
            assignIDs.forEach(ids => {
                ids.forEach(id => {
                    assignID.push(id.id);
                });
            });

            console.log(assignID);

            const lastAddedErrandId = await Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol);

            for (const id of assignID) {
                await ErrandEmployee.addRow(lastAddedErrandId, id);
            }
        }

        console.log('Завершено сохранение в базу данных');

        // Возможно, вы хотите отправить какой-то ответ об успешном завершении
        // res.send('Данные успешно сохранены в базу данных');
    } catch (error) {
        console.error('Произошла ошибка при сохранении в базу данных', error);
        // Обработка ошибки
        res.status(500).send('Произошла ошибка при сохранении в базу данных');
    }
});


// exports.saveToDB = asyncHandler(async (req, res) => {

//     const idProtocol = await Protocol.getLastProtocolId();
  
//     const promises = [];
//     console.log(req.body.errandArray)
//     req.body.errandArray.forEach(errand => {
  
//       errand.parsedAsgnName.forEach(name => {
//         promises.push(Employee.findByName(parseName(name)));
//       });
      
//       const promiseAll = Promise.all(promises);
  
//       promiseAll.then(results => {
  
//         const assignIDs = [];
  
//         results.forEach(result => {
//           assignIDs.push(result.id);
//         });
        
//         return assignIDs;
  
//       })
//       .then(async assignIDs => {
  
//         Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol);
//         const lastAddedErrandId = await Errand.getLastAddedErrandId();
//         assignIDs.forEach(id => {
//         ErrandEmployee.addRow(lastAddedErrandId, id);
  
//       })
//       .catch(err => {
//         console.log(err);
//       });
  
//       // сброс массива промисов
//       promises.length = 0;
  
//     });
  
//   });

//   })

function parseName(name) {
    if (name.indexOf(ZGD))
        return {ZGD: true}
    let parsedName = name.split(" ");
    let shortForm = false;
    if (parsedName.length == 2) {
        shortForm = true;
        parsedName.push(parsedName[1].substring(parsedName[1].indexOf('.') + 1, parsedName[1].lastIndexOf('.') + 1));
        parsedName[1] = parsedName[1].substring(0, parsedName[1].indexOf(parsedName[2]));
    }
    return { shortForm: shortForm, lastName: parsedName[0], firstName: parsedName[1], middleName: parsedName[2] };
}