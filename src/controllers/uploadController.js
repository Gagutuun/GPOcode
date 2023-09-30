const asyncHandler = require('express-async-handler'); 

const pdfParser = require('../utils/pdfParser');
const findNewAssign = require('../utils/finder');
const Protocol = require('../models/protocol');
const path = require('path');
const fs = require('fs');
const Errand = require('../models/errand');

// Путь до временной папки
const TEMP_DIR_PATH = path.join(
  path.join(__dirname.replace('controllers', 'public/files')),
  '/',
  'temp'  );

  exports.uploadFile = asyncHandler(async (req, res) => {
  
    // Проверка на то, что файл пришел на сервер
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }

    const { protocolDate, protocolNumber } = req.body;

    // Создание временной папки
    fs.mkdirSync(TEMP_DIR_PATH);
  
    // Объект, хронящий информацию о загруженном файле
    let sampleFile = req.files.sampleFile;
    // Путь, по которому будет загружен файл
    let uploadPath = path.join(TEMP_DIR_PATH, '/', sampleFile.name);
  
    // Перемещение файла по пути загрузки
    await sampleFile.mv(uploadPath);
  
    // Новый путь, по которому будет хранится файл
    let newFilePath = uploadPath.replace("temp", "Protocols")
                                .replace(".pdf", `_${protocolDate}_${protocolNumber}.pdf`);
  
    // Перемещение файла по новому пути, по факту переименовывание файла
    fs.renameSync(uploadPath, newFilePath);
  
    // Удаление временной папки
    fs.rmdirSync(TEMP_DIR_PATH)
  
    const resultsOfParsing = await _parseAndSavePDF(newFilePath, protocolDate, protocolNumber);
  
    // Рендерим страницу с результатом работы алгоритма
    res.render('result', { title: 'GPO_test', text: resultsOfParsing.pdfData , result: resultsOfParsing.errandArray});
  });
  
  async function _parseAndSavePDF(filePath, protocolDate, protocolNumber) {
    return new Promise(async (resolve, reject) => {
      // Парсим pdf
      const pdfData = await pdfParser.parsePDF(filePath);
      // Из всего текста документа получаем интересующий контент, формируя из него массив
      const errandArray = findNewAssign(pdfData);
  
      // Отправляем запрос к бд на добавление нового протокола
      await Protocol.addNewProtocol(filePath, protocolDate, protocolNumber);
  
      // Получаем id, последнего добавленного Протокола
      const idProtocol = await Protocol.getLastProtocolId();
    
      // Идем по каждому элементу массива, отправляя запрос к бд на добавление новых записей в Errand
      errandArray.forEach(errand => {
        // Т.к. сейчас непонятно кому давать поручение, assignID = 1
        // const assignID = await User.getIdByName(errand.asgnName);
        const assignID = 1;
        Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol, assignID);
      });
  
      resolve({
        pdfData: pdfData,
        errandArray: errandArray
      });
    });
  }
