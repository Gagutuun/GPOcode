const express = require('express');
const router = express.Router();

const mainRouter = require('./mainRouter');
const uploadRouter = require('./uploadRouter');
const authRouter = require('./authRouter');
const testRouter = require('./testRouter');

// Use routes
router.use('/', mainRouter);
router.use('/upload', uploadRouter);
router.use('/auth', authRouter);
router.use('/test', testRouter);


module.exports = router;
