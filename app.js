var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* routes/index.js, routes/users.js, routes/birds.js */
var routes = require('./routes/index');
var users = require('./routes/users');
var birds = require('./routes/birds.js');

var app = express();

// CONNECT TO MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/opspa1');
var db = mongoose.connection;

db.on('error', function () {
    console.log('Database connection error');
});

db.once('open', function () {
    console.log('Connected to database');
});

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

// app.get('/', function (req, res) { res.render('home'); });


/* MONGO SECTION =============================== */
var pamongo = require('./pamongo.js');

app.get('/', function (req, res) {
    var theurl = req.params.url;

    pamongo.find( {} ).exec(function (err, results) {
        if (err) {
            console.log('mongo.find errro: ' + err);
        } else {
            res.render('home', {
                theurl: theurl,
                results: results
            });
        }
    });

});

app.get('/newpost', function (req, res) {

    var newpost = new pamongo();

    res.render('newpost', {
        newpost: newpost
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
