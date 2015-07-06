var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

/* routes/index.js, routes/users.js, routes/birds.js */
var routes = require('./routes/index');
var users = require('./routes/users');
//var birds = require('./routes/birds.js');

var app = express();

var http = require('http');
var server = http.createServer(app);

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
// methodOverride is use for app.PUT, app.DELETE
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // DEBUG
        console.log(req.body);

        // look in urlencode POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/', routes);
//app.use('/users', users);

/* use birds.js for http://opsvm3.turner.com:3000/birds */
//app.use('/birds', birds);

// app.get('/', function (req, res) { res.render('home'); });


/* MONGO SECTION =============================== */
var pamongo = require('./pamongo.js');

// show all data in pa1 collection
//db.pa1.find().sort({pa:1}).pretty();
app.get('/', function (req, res) {
    var theurl = req.params.url;

    pamongo.find( {}).sort({pa:1}).exec(function (err, results) {
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

// show the form for creating new post
app.get('/newpostform', function (req, res) {

    var newpost = new pamongo();
    var timenow = new Date();

    res.render('newpost', {
        newpost: newpost,
        timenow: timenow
    });
});

// posting data from from to MongoDB
app.post('/newpostform/posttomongo', function (req, res) {
    // console.log(req.body);

    pamongo.create(req.body, function (err, results) {
        if (err) {
            console.log('db error in POST: ' + err);
        } else {
            var url = '/';
            res.redirect(url);
        }
    });
});

// display form to edit existing data
app.get('/edit/:id', function (req, res) {
    // :id
    var reqid = req.params.id;

    pamongo.findById(reqid).exec(function (err, result) {
        res.render('editform', {
            reqid: reqid,
            result: result
        });
    });
});

// PUT, methodOverride middleware
app.put('/update/:id', function (req, res) {

    // 1. search for the post
    // 2. if post is found, edit the data
    pamongo.findById(req.params.id).exec(function (err, result) {
        if (err) {
            console.log('General error: ' + err);
        } else if (!result) {
            console.log('No results found');
        } else {
            // post found, edit the data
//            result.pa = req.body.pa;
            var d = new Date();
            var timeString = d.getHours() + ':' + d.getMinutes() + ' ' + d.getMonth() + '/' + d.getDate();

            result.source = req.body.source;
            result.client = req.body.client;
            result.note = req.body.note;
            result.update = timeString;
            result.initial = req.body.initial;

            result.save(function (err) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    var url = '/';
                    res.redirect(url);
                }
            });
        }
    });
});

// PUT, methodOverride middleware
// clear post data
app.put('/clear/:id', function (req, res) {
    // 1. search for the specific post
    // 2. edit the data
    pamongo.findById(req.params.id).exec(function (err, result) {
        if (err) {
            console.log('general error: ' + err);
        } else if (!result) {
            console.log('cannot find post');
        } else {
            // found post, edit the data

            result.source = '';
            result.client = '';
            result.note = '';
            result.update = '';
            result.initial = '';

            result.save(function (err) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    var url = '/';
                    res.redirect(url);
                }
            });
        }
    });
});

// DELETE a post from pa1 collection
// methodOverride middleware
app.delete('/delete/:id', function (req, res) {
    // console.log(req.params.id);

    pamongo.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log('Cannot not find: ' + req.params.id);
        } else {
//            console.log('GOOOD TO DO');
            var url = '/';
            res.redirect(url);
        }
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


//module.exports = app;

server.listen(3000);
