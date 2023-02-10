var express = require('express');
var router = express.Router();

/* GET task page. */
router.get('/', function(req, res, next) {
  res.render('task', { title: 'GPO_test' });
});

module.exports = router;



