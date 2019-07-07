'use strict';
const express = require('express');
const router = express.Router();
const token = require('../common');

const pgClient = require('../database').client;

router.post('/', token.handler, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const getQuery = `SELECT name, id FROM ${userId}.food ORDER BY limit_day`;

        const result = await pgClient.query(getQuery)
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

/* GET home page. */
router.get('/', function (req, res) {

    res.render('list', {
        title: '一覧',
    });
});

module.exports = router;