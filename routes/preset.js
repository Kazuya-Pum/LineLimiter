'use strict';
require('date-utils');
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;

// Ajax
router.post('/', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM center.preset ORDER BY name';
        const result = await pgClient.query(query);

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

// 入力
router.get('/', function (req, res) {
    res.render('preset');
});

module.exports = router;