var express = require('express');
var router = express.Router();

router.get('/result', function(req, res, next) {
  res.render('result', { title: 'GPO_test' });
});


module.exports = router;
