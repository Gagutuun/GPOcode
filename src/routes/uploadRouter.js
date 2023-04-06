const express = require('express');
const router = express.Router();
const uploadController = require('./../controllers/uploadController');

router.post('/', uploadController.uploadProtocol);
console.log("Перешел на страницу");
module.exports = router;