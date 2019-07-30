'use strict';
const express = require('express');
const router = express.Router();
const token = require('../common');

const pgClient = require('../database').client;

router.post('/', token.handler, async (req, res, next) => {
    try {
        const userId = req.session.userId;

        const centerQuery = { text: 'SELECT view_mode FROM center.user WHERE user_id = $1', values: [userId] };
        const getQuery = `SELECT * FROM ${userId}.food WHERE enabled = TRUE ORDER BY limit_day`;

        const values = await Promise.all([
            (async () => {
                return (await pgClient.query(centerQuery)).rows[0].view_mode;
            })(),
            (async () => {
                return (await pgClient.query(getQuery)).rows;
            })()
        ]);

        const result = {
            viewMode: values[0],
            food: values[1]
        };

        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/get', token.handler, async (req, res, next) => {
    try {
        if (isNaN(req.body.id) || req.body.id <= 0) {
            throw new Error('invalid id');
        }

        const userId = req.session.userId;
        const getQuery = `SELECT * FROM ${userId}.food WHERE id = ${req.body.id} LIMIT 1`;

        const result = await pgClient.query(getQuery);
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

router.post('/use', token.handler, async (req, res, next) => {
    try {
        if (isNaN(req.body.id) || req.body.id <= 0) {
            throw new Error('invalid id ' + req.body.id);
        }

        const userId = req.session.userId;
        const query = `UPDATE ${userId}.food SET enabled = NOT enabled WHERE id = ${req.body.id} RETURNING enabled`;

        const result = await pgClient.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

/* GET home page. */
router.get('/', function (req, res) {

    res.render('list');
});

module.exports = router;