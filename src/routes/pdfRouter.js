const path = require('path');
const express = require('express');
const router = express.Router();
const Protocol = require('../models/protocol');

// Маршрут для отдачи файла PDF
router.get('/', (req, res) => {
  const filePath = path.join(Protocol.getLastProtocolPath); // Нужно как-то сказать по какому пути лежит нужный файл
  res.sendFile(filePath);
});

module.exports = router;