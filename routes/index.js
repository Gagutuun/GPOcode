var express = require('express');
var router = express.Router();
// var DBHelper = require('../public/javascripts/DBHelper');
// var dbHelper = new DBHelper();
// dbHelper.testGetReq();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GPO_test' });
});



module.exports = router;
