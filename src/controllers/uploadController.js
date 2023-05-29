const asyncHandler = require('express-async-handler'); 
const pdfParser = require('../utils/pdfParser');
const findNewAssign = require('../utils/finder');
const fs = require('fs');
const Protocol = require('../models/protocol');
const Errand = require('../models/errand');
const path = require('path');

exports.uploadFile = asyncHandler(async (req, res) => {
  // Regex для определния файла, как протокол
  const PROTOCOL_NAME_REGEX = /([Pp]roto[ck]ol|[Пп]ротокол)/;

  // Путь до папки с файлами
  const FILES_DIR_PATH = path.join(__dirname.replace('controllers', 'public/files'));

  // Создание временной папки
  fs.mkdir(path.join(FILES_DIR_PATH, '/', 'temp'), (err) => {
    if (err)
      return console.error('FATAL: ' + err);
    });
  _Await();

  // Путь до временной папки
  const TEMP_DIR_PATH = path.join(FILES_DIR_PATH, '/temp');

  // Проверка на то, что файл пришел на сервер
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  // Объект, хронящий информацию о загруженном файле
  let sampleFile = req.files.sampleFile;
  // Путь, по которому будет загружен файл
  let uploadPath = path.join(TEMP_DIR_PATH, '/', sampleFile.name);
  _Await();

  // Перемещение файла по пути загрузки
  await sampleFile.mv(uploadPath);

  // Новый путь, по которому будет хранится файл
  let newFilePath;
  // Проверка на то, что файл является Протоколом
  if (PROTOCOL_NAME_REGEX.exec(uploadPath) != null) {
    // Если да, то
    // Новый путь будет в папке Protocols, а к имени файла будет приписана временная метка (Время, в которое был загружен файл. Нужно для индивидуальности имени)
    newFilePath = _IntegrateTimeLableIntoFileName(
      _MakeTimeLable(),
      uploadPath.replace('temp', 'Protocols')
    )
  }

  // Перемещение файла по новому пути, по факту переименовывание файла
  fs.rename(uploadPath, newFilePath, (err) => {
    if (err)
      console.error(err);
  });
  _Await();

  // Удаление временной папки
  fs.rmdir(
    TEMP_DIR_PATH,
    (err) => {
      if (err)
        console.error(err);
    }
  )

  // Парсим pdf
  const pdfData = await pdfParser.parsePDF(newFilePath);
  // Из всего текста документа получаем интересующий контент, формируя из него массив
  const errandArray = findNewAssign(pdfData);

  // Отправляем запрос к бд на добавление нового протокола
  Protocol.addNewProtocol(newFilePath);

  // Получаем id, последнего добавленного Протокола
  const idProtocol = await Protocol.getLastProtocolId();
  
  // Идем по каждому элементу массива, отправляя запрос к бд на добавление новых записей в Errand
  errandArray.forEach(errand => {
    // Т.к. сейчас непонятно кому давать поручение, assignID = 1
    // const assignID = await User.getIdByName(errand.asgnName);
    const assignID = 1;
    Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol, assignID);
  })

  // Рендерим страницу с результатом работы алгоритма
  res.render('result', { title: 'GPO_test', text: pdfData , result: errandArray});
  })

function _MakeTimeLable() {
  let timeLable = new Date(Date.now()).toLocaleString("ru");
  timeLable = timeLable.replaceAll('.', '_').replaceAll(':', '-').replace(', ', '_');
  return timeLable;
}

function _IntegrateTimeLableIntoFileName(timeLable, fileName) {
  const FILE_EXTENSION = ".pdf";
  return fileName.replace(FILE_EXTENSION, "_" + timeLable) + FILE_EXTENSION;
}

function _Await() {
  const offset = 100
  const startDate = Date.now();
  while(Date.now() - startDate < offset)
    ;
}
