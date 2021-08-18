var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var pool = require('./models/bd')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { PayloadTooLarge } = require('http-errors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* pool.query('SELECT * FROM empleados').then(function   PARA ACCEDER A REGISTROS
  (resultados){
    console.log(resultados)
  }); */

 /*  var obj = {
    nombre: 'Juan',
    apellido: 'Lopez',
    trabajo: 'docente',
    edad: 38,
    salario: 87000,
    mail: 'juanlopez@bignet.com'
  }

  pool.query('INSERT INTO empleados SET ?', [obj]).then(function(resultados){
    console.log(resultados)
  })
 */

var id = 1;          
var obj = {
  nombre: 'Pablo',
  apellido: 'Gomez'
}

pool.query('UPDATE empleados SET ? WHERE id_emp=?', [obj, id]).then(function (resultados){
  console.log(resultados);
});

/* var id = 24;
pool.query('DELETE FROM empleados WHERE id_emp=?', [id]).then(function (resultados){
  console.log(resultados);
});
 */

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