var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* routes/index.js, routes/users.js, routes/birds.js */
var routes = require('./routes/index');
var users = require('./routes/users');
var birds = require('./routes/birds.js');

var app = express();


// view engine setup, handlebars
var handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({extname: 'handlebars', defaultLayout: 'main.handlebars'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/', routes);
//app.use('/users', users);

/* use birds.js for http://opsvm3.turner.com:3000/birds */
app.use('/birds', birds);

app.get('/', function (req, res) {
    res.render('home');
});


// catch 404 and forward to error handler
// error handlers
// development error handler
// production error handler


module.exports = app;
