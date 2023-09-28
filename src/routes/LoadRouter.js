const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Используйте express.urlencoded для разбора данных формы
router.use(express.urlencoded({ extended: true }));

router.post('/', uploadController.uploadFile);
console.log("Перешел на страницу");
module.exports = router;