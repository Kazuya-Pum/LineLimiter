'use strict';

const debug = require('debug');
const line = require('@line/bot-sdk');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');

const webhook = require('./routes/webhook');
const add = require('./routes/add');
const list = require('./routes/list');

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

app.use('/webhook', webhook);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/add', add);
app.use('/list', list);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
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