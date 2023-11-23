const asyncHandler = require('express-async-handler');
const Protocol = require('../models/protocol');
const Errand = require('../models/errand');
const Employee = require('../models/employee');
const ErrandEmployee = require('../models/errandEmployee');

const ZGD = "заместители генерального директора";

exports.saveToDB = asyncHandler(async (req, res) => {

  const protocolId = await Protocol.getLastProtocolId();

  try {

    for (const errand of req.body.errandArray) {

      const assignIDs = [];

      for (const name of errand.parsedAsgnName) {
        const employee = await Employee.findByName(parseName(name));
        if(employee) {
          assignIDs.push(employee.id);
        }
      }

      const errandId = await Errand.addNewErrand(errand.errandText, errand.deadline, protocolId);

      for(const id of assignIDs) {
        await ErrandEmployee.addRow(errandId, id);  
      }

    }

    res.send('Данные успешно сохранены');

  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при сохранении данных'); 
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