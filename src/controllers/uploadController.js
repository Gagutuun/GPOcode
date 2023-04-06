const asyncHandler = require('express-async-handler');
const pdfParser = require('../utils/pdfParser');
const findNewAssign = require('../utils/finder');

exports.uploadProtocol = asyncHandler(async (req, res) => {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
  
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../public/files/' + sampleFile.name;
    await sampleFile.mv(uploadPath);

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pdfData = await pdfParser.parsePDF(uploadPath);

    res.render('result', { title: 'GPO_test', text: pdfData , result: findNewAssign(pdfData)});
  })

function _MakeTimeLable() {
  let timeLable = new Date(Date.now()).toLocaleString("ru");
  timeLable = timeLable.replaceAll('.', '_').replaceAll(':', '-').replace(', ', '_');
  return timeLable;
}

function _IntegrateTimeLableIntoFileName(timeLable, fileName) {
  const FILE_EXTENSION = ".pdf";
  return fileName.replace(FILE_EXTENSION, timeLable) + FILE_EXTENSION;
}