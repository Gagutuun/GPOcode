const express = require('express');
const router = express.Router();

const mainRouter = require('./mainRouter');
const uploadRouter = require('./uploadRouter');
const authRouter = require('./authRouter');
const testRouter = require('./testRouter');
const pdfRouter = require('./pdfRouter');

// Use routes
router.use('/', mainRouter);
router.use('/upload', uploadRouter);
router.use('/auth', authRouter);
router.use('/test', testRouter);
router.use('/pdf', pdfRouter);


module.exports = router;
