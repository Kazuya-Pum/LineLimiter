'use strict';

const debug = require('debug');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');

const webhook = require('./routes/webhook');
const edit = require('./routes/edit');
const list = require('./routes/list');
const setting = require('./routes/setting');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.use('/edit', edit);
app.use('/list', list);
app.use('/setting', setting);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(404);
    res.render('err', { error: '404' });
    next(err);
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

const server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});