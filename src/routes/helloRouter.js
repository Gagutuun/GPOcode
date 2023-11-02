var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('StartPage', { title: 'Начальная страница' });
});

module.exports = router;
