const express = require('express');
const router = express.Router();

const mainRouter = require('./mainRouter');
const uploadRouter = require('./uploadRouter');
const authRouter = require('./authRouter');
const testRouter = require('./testRouter');
const pdfRouter = require('./pdfRouter');
const errands = require('./errands');
const reportProtocol = require('./reportProtocol');



// Use routes
router.use('/', mainRouter);
router.use('/upload', uploadRouter);
router.use('/auth', authRouter);
router.use('/test', testRouter);
router.use('/pdf', pdfRouter);
router.use('/downloadProtocol', mainRouter);
router.use('/errand', errands);
router.use('/reportProtocol', reportProtocol);


module.exports = router;
