var express = require('express');
var router = express.Router();

const mainRouter = require('./mainRouter');
const uploadRouter = require('./uploadRouter');
const authRouter = require('./authRouter');


// Use routes
router.use('/', mainRouter);
router.use('/upload', uploadRouter);
router.use('/auth', authRouter);


module.exports = router;
