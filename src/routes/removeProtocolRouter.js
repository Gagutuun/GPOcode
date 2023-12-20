const express = require('express');

const removeProtocolController = require('../controllers/removeProtocolController');

const router = express.Router();

router.post('/', removeProtocolController.removeLastAdded);
module.exports = router;