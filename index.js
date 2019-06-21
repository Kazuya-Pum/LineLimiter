'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const webhook = require('./routes/webhook');
const add = require('./routes/add');
const list = require('./routes/list');

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/webhook', webhook);
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