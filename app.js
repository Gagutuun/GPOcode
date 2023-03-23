var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var officeParser = require('officeparser');
var asyncHandler = require('express-async-handler')
var parser = require('./parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var resultRouter = require('./routes/result');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/upload', asyncHandler(async (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/public/files/' + sampleFile.name;

  await sampleFile.mv(uploadPath);

  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = await officeParser.parseWordAsync(uploadPath);
  
  res.render('result', { title: 'GPO_test', text: data , result: parser(data)});
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
