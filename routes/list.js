'use strict';
const express = require('express');
const router = express.Router();
const token = require('./common');

const pgClient = require('../database').client;

router.post('/', function (req, res) {

    token.handler(req)
        .then(data => {
            const getQuery = `SELECT name, id FROM ${data.userId}.food ORDER BY limit_day`;

            pgClient.query(getQuery)
                .then(result => {
                    res.json(result.rows);
                })
                .catch(err => console.error(err.stack))
        })
        .catch(err => {
            console.error(err.stack)
        })
});

/* GET home page. */
router.get('/', function (req, res) {

    res.render('list', {
        title: '一覧',
    });
});

module.exports = router;