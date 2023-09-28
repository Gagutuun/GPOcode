var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('hello', { title: 'GPO_test' });
});

module.exports = router;
