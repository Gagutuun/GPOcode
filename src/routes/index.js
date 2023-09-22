const express = require('express');
const router = express.Router();

const helloRouter = require('./helloRouter');
const uploadRouter = require('./uploadRouter');
const LoadRouter = require('./LoadRouter');
const authRouter = require('./authRouter');
const pdfRouter = require('./pdfRouter');
const errands = require('./errands');
const reportProtocol = require('./reportProtocol');
const feedback = require('./feedback');


// Use routes
router.use('/', helloRouter);
router.use('/upload', LoadRouter);
router.use('/auth', authRouter);
router.use('/pdf', pdfRouter);
router.use('/uploadProtocol', uploadRouter);
router.use('/errand', errands);
router.use('/reportProtocol', reportProtocol);
router.use('/feedback', feedback);


module.exports = router;
