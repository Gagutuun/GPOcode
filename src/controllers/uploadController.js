const asyncHandler = require('express-async-handler'); 
const pdfParser = require('../utils/pdfParser');
const findNewAssign = require('../utils/finder');
const fs = require('fs');
const Protocol = require('../models/protocol');
const Errand = require('../models/errand');

exports.uploadProtocol = asyncHandler(async (req, res) => {
  const PROTOCOL_NAME_REGEX = /([Pp]roto[ck]ol|[Пп]ротокол)/;
  const FILES_DIR = '/../public/files/';
  const TEMP_DOWNDLOAD_DIR = FILES_DIR + 'temp/';
  
  fs.mkdir(__dirname + FILES_DIR + 'temp', (err) => {
    if (err)
      return console.error('FATAL: ' + err);
  });

  _Await();

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  let sampleFile = req.files.sampleFile;
  let uploadPath = __dirname + TEMP_DOWNDLOAD_DIR + sampleFile.name;
  await sampleFile.mv(uploadPath);

  let newFilePath;
  if (PROTOCOL_NAME_REGEX.exec(uploadPath) != null) {
    newFilePath = _IntegrateTimeLableIntoFileName(
      _MakeTimeLable(),
      uploadPath.replace('temp/', 'Protocols/')
    )
  }


  fs.rename(uploadPath, newFilePath, (err) => {
    if (err)
      console.error(err);
  });

  _Await();

  fs.rmdir(
    uploadPath.replace('/' + sampleFile.name, ''),
    (err) => {
      if (err)
        console.error(err);
    }
  )

  const pdfData = await pdfParser.parsePDF(newFilePath);
  const errandArray = findNewAssign(pdfData);

  Protocol.addNewProtocol(newFilePath);

  const idProtocol = await Protocol.getLastProtocolId();
  errandArray.forEach(errand => {
    // Т.к. сейчас непонятно кому давать поручение, assignID = 1
    // const assignID = await User.getIdByName(errand.asgnName);
    const assignID = 1;
    Errand.addNewErrand(errand.errandText, errand.deadline, idProtocol, assignID);
  })

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
