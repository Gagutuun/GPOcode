const express = require('express');
const passport = require('../config/authConfig');

const router = express.Router();

router.post('/login', passport.authenticate('local', {
    successRedirect: '/uploadProtocol',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/login', (req, res) => {
  const message = req.flash('error')[0];
  res.render('auth', { message });
});

module.exports = router;
