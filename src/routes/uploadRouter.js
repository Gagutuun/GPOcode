const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/'/*, authMiddleware.isAuthenticated*/ ,function (req, res, next) {
  res.render('uploadProtocol', { title: 'Загрузка протокола' });
});


module.exports = router;
