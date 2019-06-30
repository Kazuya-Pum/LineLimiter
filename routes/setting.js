'use strict';
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;
const token = require('./common');

router.post('/', function (req, res) {
    token.handler(req)
        .then(userId => {
            const notification = Number(req.body.notification);

            if (notification == null) {
                throw new Error('undefined notification');
            }

            const query = `UPDATE center.user SET notification = ${notification} WHERE user_id = '${userId}'`;

            pgClient.query(query)
                .then(result => {

                    res.sendStatus(200);
                })
                .catch(err => {
                    console.error(err.stack);
                    res.send(err);
                })
        })
        .catch(err => {
            console.error(err.stack);
            res.send(err);
        })
})

// Ajax
router.post('/get', function (req, res) {

    token.handler(req)
        .then(userId => {

            const query = `SELECT notification FROM center.user WHERE user_id = '${userId}'`;

            pgClient.query(query)
                .then(result => {

                    res.json({
                        notification: result.rows[0].notification
                    });
                })
                .catch(err => {
                    console.error(err.stack);
                    res.send(err);
                })
        })
        .catch(err => {
            console.error(err.stack);
            res.send(err);
        })
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('setting', {

    });
});

module.exports = router;