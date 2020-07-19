require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cors = require('cors')

const Router = require('./routes');
const dbConnection = require('./src/config/dbConnect')
const passport = require('./src/config/passportConfig')
const checkLoggedIn = require('./routes/middlewares/checkLoggedIn')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: dbConnection,
    autoRemove:'native',
    autoRemoveInterval:'1440'
  }),
  cookie:{
    maxAge:1000*60*60*24
  }
})

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/authapi', Router.authRouter);
app.use('/clientapi', checkLoggedIn, Router.clientRouter);
app.use('/oauth', Router.oauthRouter)
app.use('/resapi', Router.resRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
