const express = require('express');
const passport = require('../config/authConfig');

const router = express.Router();

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/login', (req, res) => {
  res.render('auth', { message: 'Неправильный логин или пароль!' });
});

module.exports = router;
