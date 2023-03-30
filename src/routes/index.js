const express = require('express');
const router = express.Router();

// Import routes
const mainRouter = require('./mainRouter');
const uploadRouter = require('./uploadRouter');

// Use routes
router.use('/', mainRouter);
router.use('/upload', uploadRouter)

module.exports = router;