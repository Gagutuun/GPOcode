const express = require('express');

const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('feedback', { title: 'Обратная связь' });
});


module.exports = router;
