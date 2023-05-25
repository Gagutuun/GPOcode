const path = require('path');
const express = require('express');
const router = express.Router();
const Protocol = require('../models/protocol');

// Маршрут для отдачи файла PDF
router.get('/', (req, res) => {
  Protocol.getLastProtocolId()
    .then((protocolId) => {
      Protocol.getProtocolPathByID(protocolId)
        .then((protocolPath) => {
          const filePath = path.join(protocolPath);
          res.sendFile(filePath);
        })
    })
    .catch()
});

module.exports = router;