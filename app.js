const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const winslog = require('./src/config/winston');
const router = require('./routes/index');
const dbConnection = require('./src/config/dbConnect');
const userpassport = require('./src/config/userPassport');

process.on('uncaughtException', (err, origin) => {
  console.log({
    err,
    origin
  });
  winslog.log({
    level: 'error',
    message: 'err is ' + err.message + 'origin is' + origin
  })
});


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: dbConnection
  })
}));
app.use(userpassport.initialize());
app.use(userpassport.session());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router.users);
app.use('/oauth', router.oauth);
app.use('/api', router.api);
app.use('/client', router.client)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  winslog.log({
    level: 'error',
    message: 'err is ' + err.error
  })
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;