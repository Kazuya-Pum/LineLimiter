'use strict';
require('date-utils');
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;
const token = require('./common');

// 登録
router.post('/', function (req, res) {

    token.handler(req)
        .then(userId => {

            if (!req.body.name || !req.body.limit_day) {
                throw new Error('パラメータ不足');
            }

            const date = new Date(req.body.limit_day);
            const id = Number(req.body.id);

            let query = '';
            if (id) {
                query = `UPDATE ${userId}.food SET name = '${req.body.name}', limit_day = '${date.toFormat('YYYY-MM-DD')}', image_url = '${req.body.imageUrl}', place = '${req.body.place}', memo = '${req.body.memo}', category = '${req.body.category}', notification_day = ARRAY[${req.body.notification}] WHERE id = ${id}`;
            } else {
                query = `INSERT INTO ${userId}.food (name, limit_day, image_url, place, memo, category, notification_day) VALUES ('${req.body.name}', '${date.toFormat('YYYY-MM-DD')}', '${req.body.imageUrl}', '${req.body.place}', '${req.body.memo}', '${req.body.category}', ARRAY[${req.body.notification}])`;
            }
            console.log(query);
            pgClient.query(query)
                .then(res => console.log("add food"))
                .catch(err => console.error(err.stack))

            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err.stack);
            res.sendStatus(400);
        })
});

// Ajax
router.post('/get', function (req, res) {

    token.handler(req)
        .then(userId => {

            const centerQuery = `SELECT notification_day FROM center.user WHERE user_id = '${userId}'`;
            pgClient.query(centerQuery)
                .then(result => {
                    const notification_list = result.rows[0].notification_day;
                    const id = Number(req.body.id);

                    if (!id) {

                        res.json({
                            notification_list: notification_list
                        });
                        return;
                    }

                    const query = `SELECT name, limit_day, place, memo, category, image_url, notification_day FROM ${userId}.food WHERE id = ${id}`;

                    pgClient.query(query)
                        .then(result => {

                            const date = new Date(result.rows[0].limit_day);

                            res.json({
                                name: result.rows[0].name,
                                limit_day: date.toFormat('YYYY-MM-DD'),
                                place: result.rows[0].place,
                                memo: result.rows[0].memo,
                                category: result.rows[0].category,
                                image_url: result.rows[0].image_url,
                                notification: result.rows[0].notification_day,
                                notification_list: notification_list
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
        })
        .catch(err => {
            console.error(err.stack);
            res.send(err);
        })

});

// 入力
router.get('/', function (req, res) {

    let title = '新規登録';
    if (req.query.id) {
        title = '編集';
    }

    res.render('edit', {
        title: title,
        name: null,
        limit_day: null,
        place: null,
        memo: null,
        category: null,
        image_url: null
    });
});

// カテゴリ
router.get('/category/:value', function (req, res) {
    res.render('edit', {
        title: 'カテゴリから登録',
        name: '',
        limit_day: '',
        place: '',
        memo: '',
        category: '',
        image_url: null
    });
});

module.exports = router;