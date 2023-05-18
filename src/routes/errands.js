const express = require('express');
//const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('errand', { title: 'GPO_test' });
});


module.exports = router;
