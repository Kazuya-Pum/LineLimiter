'use strict';
const express = require('express');
const router = express.Router();
const token = require('../common');

const pgClient = require('../database').client;

router.post('/', token.handler, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const getQuery = `SELECT * FROM ${userId}.food WHERE enabled = FALSE ORDER BY name`;

        const result = await pgClient.query(getQuery);
        res.json(result.rows);
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

router.post('/delete', token.handler, async (req, res, next) => {
    try {
        if (isNaN(req.body.id) || req.body.id <= 0) {
            throw new Error('invalid id ' + req.body.id);
        }

        const userId = req.session.userId;
        const delQuery = `DELETE FROM ${userId}.food WHERE id = ${req.body.id} RETURNING image_url`;

        const delImage = await pgClient.query(delQuery);

        if (delImage.rows.length != 0) {
            require('../upload').deleteFile(delImage.rows[0].image_url);
        }

        const getQuery = `SELECT id, name, image_url, category, place FROM ${userId}.food WHERE enabled = FALSE ORDER BY name`;

        const result = await pgClient.query(getQuery);

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

/* GET home page. */
router.get('/', function (req, res) {

    res.render('history');
});

module.exports = router;