var express = require('express');
var router = express.Router();

// middleware specific to this route
// this will always run when this router is activated
router.use(function (req, res, next) {
    console.log('Time: ' + Date.now());
    next();
});

// define home page for routes
router.get('/', function (req, res) {
    res.render('birdhome');
});

router.get('/about', function (req, res) {
    res.send('Birds About');
});

module.exports = router;