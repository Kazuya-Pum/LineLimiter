'use strict';

const debug = require('debug');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const session = require('express-session');

const webhook = require('./routes/webhook');
const edit = require('./routes/edit');
const list = require('./routes/list');
const setting = require('./routes/setting');
const history = require('./routes/history');

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

app.use('/webhook', webhook);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/icon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'line limiter',
    resave: false,
    saveUninitialized: true
}));

app.use('/edit', edit);
app.use('/list', list);
app.use('/setting', setting);
app.use('/history', history);
app.use('/preset', require('./routes/preset'));
app.use('/help', (req, res, next) => {
    res.render('help');
})

app.use('/bin/notification', (req, res, next) => {
    if (req.get('X-Appengine-Cron') === 'true') {
        require('./bin/notification')();
        res.sendStatus(200).end();
    } else {
        res.sendStatus(403).end();
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    console.error(err.stack);

    const status = err.status || 500;

    res.status(status);
    res.render('err', {
        status: status,
        error: err.message
    });
})

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

const server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});