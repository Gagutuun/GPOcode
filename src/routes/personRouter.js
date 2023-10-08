var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('Person', { title: 'Профиль' });
});

module.exports = router;
