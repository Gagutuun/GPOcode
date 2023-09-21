const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.isAuthenticated ,function (req, res, next) {
  res.render('main', { title: 'GPO_test' });
});


module.exports = router;
