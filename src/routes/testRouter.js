var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('sidebar', { title: 'GPO_test' });
});


module.exports = router;
