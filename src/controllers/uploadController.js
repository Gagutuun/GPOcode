const asyncHandler = require('express-async-handler');
const pdfParser = require('../utils/pdfParser');
const findNewAssign = require('../utils/finder');
const { rename } = require('fs');

exports.uploadProtocol = asyncHandler(async (req, res) => {
  const TEMP_DOWNDLOAD_DIR = '/../public/files/temp/';
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + TEMP_DOWNDLOAD_DIR + sampleFile.name;
  await sampleFile.mv(uploadPath);

  let newFilePath = _IntegrateTimeLableIntoFileName(
    _MakeTimeLable(),
    uploadPath.replace('temp/', '')
  )
  rename(uploadPath, newFilePath, (err) => {
    if(err)
      console.error(err);
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // _AwaitFileRedirection();

  const pdfData = await pdfParser.parsePDF(uploadPath);
  const assignArray = findNewAssign(pdfData);

  res.render('result', { title: 'GPO_test', text: pdfData , result: assignArray});
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

function _AwaitFileRedirection() {
  const offset = 100;
  const startDate = Date.now();
  while(Date.now() - startDate < offset)
    ;
}