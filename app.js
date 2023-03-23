var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var officeParser = require('officeparser');
var asyncHandler = require('express-async-handler')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var resultRouter = require('./routes/result');

var app = express();

const UPLINE = "РЕШИЛИ: ";
const TIMETOEND = "Срок исполнения";
const LASTRESH = "Решения предыдущих совещаний";
const OTVETV = "Ответственн";
const ZAMS = "заместители генерального директора";
const DIRECTOR = "Бакало";


function Finder(data) {
  let regPoruch = new RegExp("\d{1,}[.]");
  let parsedData = new Array();//Матрица данных, которые отправляем в БД
  data = data.replace(data.substr(0, data.indexOf(UPLINE) + 8 ), ""); //Убираем все до "РЕШИЛИ: " включительно. 
  console.log(data);
  console.log();
  while(data.indexOf(TIMETOEND) != -1) {
      while(data.charAt(0)== ' ')
          data = data.replace(" ","");
      if(data.indexOf(LASTRESH) == 0)
          data = data.replace(LASTRESH + ' ',"");
      substrOfData = data.slice(0, data.indexOf(TIMETOEND) + 29);//Вырезаем подстроку для обработки
      data = data.replace(substrOfData, "");//И сразу же удаляем ее
      NameOfAsgmnt = substrOfData.slice(substrOfData.indexOf(OTVETV)+16, substrOfData.indexOf("Срок")); // Выделяем имена ответственных
      if(NameOfAsgmnt.indexOf(DIRECTOR)!=-1||NameOfAsgmnt.indexOf(ZAMS)!=-1){ // Проверяем на наличие нужных имён
          DateOfExe = substrOfData.slice(substrOfData.indexOf(TIMETOEND + " – ") + 18, substrOfData.indexOf(". П")); // Выделяем дату поручения
          TextOfPoruch = substrOfData.slice(substrOfData.search(regPoruch) + regPoruch.length, substrOfData.indexOf(". " + OTVETV)); // Выделяем текст поручения
      } else continue;
      console.log(substrOfData);
      //ReqToBase();
      data=data.replace(substrOfData, "");
      substrOfData = null;
      parsedData.push(new Array(TextOfPoruch, NameOfAsgmnt, DateOfExe));
  }
  return parsedData;
}



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
app.post('/upload', function(req, res, next) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.sampleFile;

  uploadPath = __dirname + '/public/files/' + sampleFile.name;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    //res.render('result', { title: 'GPO_test' });
  });
  next();
});

app.post(
  '/upload',
  asyncHandler(async (req, res) => {
    await sleep(1000)
      function sleep(ms) {
        return new Promise((resolve) => {
        setTimeout(resolve, ms);
  });
}
    await officeParser.parseWordAsync(/* PATH */"public/files/protokol.docx")
    .then((data) => {

      res.render('result', { title: 'GPO_test', text: data , result: Finder(data)});
        });
  })
)

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
