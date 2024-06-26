var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Import the generateUniqueId function
var generateUniqueId = require('./functions/sessionIdFunctions');

var indexRouter = require('./routes/index');
var searchRouter = require('./routes/searchRoute');
var allItemsRouter = require('./routes/allItemsRoute');
var itemBySkuRouter = require('./routes/itemBySkuRoute');
var loginRouter = require('./routes/loginRoute');
var registerRouter = require('./routes/registerRoute');
var getUserByEmployeeIdRouter = require('./routes/getUserByEmployeeIdRoute');
var tokenRefreshRouter = require('./routes/tokenRefreshRoute');
var createRegistrationKeyRouter = require('./routes/createRegistrationKeyRoute');
var itemQuantityAdjustRouter = require('./routes/itemQuantityAdjustRoute');

// Import the logRequest middleware
var logRequest = require('./custom_middleware/logMiddleware');

var app = express();
global.uniqueId = generateUniqueId();
global.tokenBlacklist = new Set(); // Initialize the tokenBlacklist global set

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Use the logRequest middleware for logging
app.use(logRequest);

app.use('/', indexRouter);
app.use('/', searchRouter);
app.use('/', allItemsRouter);
app.use('/', itemBySkuRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', getUserByEmployeeIdRouter);
app.use('/', tokenRefreshRouter);
app.use('/', createRegistrationKeyRouter);
app.use('/', itemQuantityAdjustRouter);

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
