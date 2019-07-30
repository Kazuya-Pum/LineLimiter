'use strict';
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;
const token = require('../common');

router.post('/', token.handler, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const notification = Number(req.body.notification);

        const notificationDay = req.body.notificationDay.sort((a, b) => { return a - b; });
        const viewMode = req.body.viewMode;

        if (isNaN(notification)) {
            throw new Error('undefined notification');
        }

        const query = `UPDATE center.user SET notification = $1, notification_day = $2, view_mode = $3 WHERE user_id = $4`;
        const values = [notification, notificationDay, viewMode, userId];

        await pgClient.query(query, values);
        res.sendStatus(200);

    } catch (err) {
        next(err);
    }
})

// Ajax
router.post('/get', token.handler, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const query = `SELECT notification, notification_day, view_mode FROM center.user WHERE user_id = '${userId}'`;

        const result = await pgClient.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('setting');
});

module.exports = router;