'use strict';
const express = require('express');
const router = express.Router();

const pgClient = require('../database').client;

router.post('/', function (req, res) {

    const getQuery = `SELECT name FROM ${req.body.userId}.food`;
    let list = [];

    pgClient.query(getQuery)
        .then(res => {
            console.log(res.rows);
            list = res.rows;
        })
        .catch(err => console.error(err.stack))

    res.render('list', {
        title: '一覧',
        list: list
    });
});

/* GET home page. */
router.get('/', function (req, res) {
    const getQuery = `SELECT name FROM ub6d643505c8217a316700b16b986f48c.food`;

    pgClient.query(getQuery)
        .then(result => {
            const list = result.rows;
            console.log(list);

            res.render('list', {
                title: '一覧',
                list: list
            });
        })
        .catch(err => console.error(err.stack))
});

module.exports = router;