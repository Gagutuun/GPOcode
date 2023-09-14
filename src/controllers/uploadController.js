const asyncHandler = require('express-async-handler'); 

const pdfParser = require('../utils/pdfParser');
const findNewAssign = require('../utils/finder');

const fs = require('fs');

const Protocol = require('../models/protocol');
const Errand = require('../models/errand');

const path = require('path');

// Путь до временной папки
const TEMP_DIR_PATH = path.join(
  path.join(__dirname.replace('controllers', 'public/files')),
  '/',
  'temp'  );

let debugInfo = new String();


exports.uploadFile = asyncHandler(async (req, res) => {
  debugInfo = "";

  // Создание временной папки
  fs.mkdirSync(TEMP_DIR_PATH);

  // Проверка на то, что файл пришел на сервер
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  // Объект, хронящий информацию о загруженном файле
  let sampleFile = req.files.sampleFile;
  // Путь, по которому будет загружен файл
  let uploadPath = path.join(TEMP_DIR_PATH, '/', sampleFile.name);

  // Перемещение файла по пути загрузки
  await sampleFile.mv(uploadPath);

  // Новый путь, по которому будет хранится файл
  let newFilePath = (/([Pp]roto[ck]ol|[Пп]ротокол)/.exec(uploadPath) != null) 
    ? _IntegrateTimeLableIntoFileName(
        _MakeTimeLable(),
        uploadPath.replace('temp', 'Protocols'))
    : null;

  console.log("newFilePAth = " + newFilePath);

  // Перемещение файла по новому пути, по факту переименовывание файла
  fs.renameSync(uploadPath, newFilePath);

  // Удаление временной папки
  fs.rmdirSync(TEMP_DIR_PATH)

  await _parseAndSavePDF(newFilePath);

  // Рендерим страницу с результатом работы алгоритма
  res.render('result', { title: 'GPO_test', text: pdfData , result: errandArray});
  })

async function _parseAndSavePDF(filePath) {
  // Парсим pdf
  console.log("filePath = " + filePath);
  const pdfData = await pdfParser.parsePDF(filePath);
  // Из всего текста документа получаем интересующий контент, формируя из него массив
  const errandArray = findNewAssign(pdfData);

  // Отправляем запрос к бд на добавление нового протокола
  Protocol.addNewProtocol(filePath);

  // Получаем id, последнего добавленного Протокола
  const idProtocol = await Protocol.getLastProtocolId();
  
  // Идем по каждому элементу массива, отправляя запрос к бд на добавление новых записей в Errand
  errandArray.forEach(errand => {
    // Т.к. сейчас непонятно кому давать поручение, assignID = 1
    // const assignID = await User.getIdByName(errand.asgnName);
    const assignID = 1;
    Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol, assignID);
  })
}

function _MakeTimeLable() {
  let timeLable = new Date(Date.now()).toLocaleString("ru");
  timeLable = timeLable.replaceAll('.', '_').replaceAll(':', '-').replace(', ', '_');
  return timeLable;
}

function _IntegrateTimeLableIntoFileName(timeLable, fileName) {
  const FILE_EXTENSION = ".pdf";
  return fileName.replace(FILE_EXTENSION, "_" + timeLable) + FILE_EXTENSION;
}
