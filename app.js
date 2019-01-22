const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const ottext = require('ot-text');
const ShareDB = require('@teamwork/sharedb');

const mongoAndRedisConnection = require('./bin/mongoRedisConnection');

const share = new ShareDB({
  db: mongoAndRedisConnection.mongo,
  pubsub: mongoAndRedisConnection.redis,
  disableSpaceDelimitedActions: true,
  disableDocAction: true
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

ShareDB.types.register(ottext.type);

/* Routers */
const indexRouter = require('./routes');
const apiRouter = require('./routes/api');

/* Start Express */
const app = express();

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Routers */
app.use('/', indexRouter);
app.use('/api', apiRouter);

/* Middlewares */
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

/* catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createError(404));
});

/* error handler */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* render the error page */
  res.status(err.status || 500);
  res.render('error');
});

app.sharedb = share;
module.exports = app;
