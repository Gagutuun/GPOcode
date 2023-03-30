const express = require('express');
const asyncHandler = require('express-async-handler');
const fileUpload = require('express-fileupload');
const parser = require('../utils/parser');
const officeParser = require('officeparser');
const router = express.Router();

router.use(fileUpload());

router.post('/', asyncHandler(async (req, res) => {
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

  const data = await officeParser.parseWordAsync(uploadPath);
  
  res.render('result', { title: 'GPO_test', text: data , result: parser(data)});
}));

module.exports = router;
