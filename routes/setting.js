'use strict';
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;
const token = require('../common');

router.post('/', token.handler, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const notification = Number(req.body.notification);

        if (notification == null) {
            throw new Error('undefined notification');
        }

        const query = `UPDATE center.user SET notification = ${notification} WHERE user_id = '${userId}'`;

        await pgClient.query(query);
        res.sendStatus(200);

    } catch (err) {
        next(err);
    }
})

// Ajax
router.post('/get', token.handler, async (req, res, next) => {

    try {
        const userId = req.session.userId;
        const query = `SELECT notification FROM center.user WHERE user_id = '${userId}'`;

        const result = await pgClient.query(query);

        res.json({
            notification: result.rows[0].notification
        });

    }
    catch (err) {
        next(err);
    }
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('setting', {

    });
});

module.exports = router;