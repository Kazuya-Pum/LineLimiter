'use strict';
require('date-utils');
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;
const token = require('../common');
const storage = require('../upload');

// 登録
router.post('/', token.handler, storage.multer, storage.upload, async (req, res, next) => {

    try {
        const userId = req.session.userId;
        console.log(req.body);
        if (!req.body.name || !req.body.limit_day) {
            throw new Error('パラメータ不足');
        }

        // TODO パラメータチェック

        const id = Number(req.body.id);

        const notification = (Array.isArray(req.body.notification)) ? req.body.notification.map(str => parseInt(str, 10)) : [];

        const memo = (Array.isArray(req.body.memo)) ? req.body.memo.filter((str) => {
            const _str = str.trim();
            if (_str != '' && _str.length) {
                return true;
            }
        }) : [];

        const date = new Date(req.body.limit_day);

        let query = '';
        let values = [];
        if (id) {

            const getOldImage = `SELECT image_url FROM ${userId}.food WHERE id = ${id} LIMIT 1`;
            const oldImage = await pgClient.query(getOldImage);

            let imageUrl = storage.getUrl(req);
            if (imageUrl || !req.body.image_url) {
                // TODO 他に同じURLを使っているデータがないかチェックしてから消す
                storage.deleteFile(oldImage.rows[0].image_url);
            } else if (req.body.image_url) {
                imageUrl = oldImage.rows[0].image_url;
            }

            query = `UPDATE ${userId}.food SET name = $1, limit_day = $2, image_url = $3, place = $4, memo = $5, category = $6, notification_day = $7, enabled = TRUE WHERE id = $8`;
            values = [req.body.name, date.toFormat('YYYY-MM-DD'), imageUrl, req.body.place, memo, req.body.category, notification, id]
        } else {
            query = `INSERT INTO ${userId}.food (name, limit_day, image_url, place, memo, category, notification_day) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
            values = [req.body.name, date.toFormat('YYYY-MM-DD'), storage.getUrl(req), req.body.place, memo, req.body.category, notification]
        }

        await pgClient.query(query, values);
        console.log("edit food");
        res.send("edit food");

    } catch (err) {
        next(err);
    }
});

// Ajax
router.post('/get', token.handler, async (req, res) => {
    try {
        const userId = req.session.userId;
        const centerQuery = `SELECT notification_day FROM center.user WHERE user_id = '${userId}'`;
        const centerRes = await pgClient.query(centerQuery);
        const notification_list = centerRes.rows[0].notification_day;
        const id = Number(req.body.id);
        if (!id) {
            res.json({
                notification_list: notification_list
            });
        } else {
            const query = `SELECT name, limit_day, place, memo, category, image_url, notification_day FROM ${userId}.food WHERE id = ${id}`;

            const userRes = await pgClient.query(query);
            if (userRes) {
                const date = new Date(userRes.rows[0].limit_day);

                res.json({
                    name: userRes.rows[0].name,
                    limit_day: date.toFormat('YYYY-MM-DD'),
                    place: userRes.rows[0].place,
                    memo: userRes.rows[0].memo,
                    category: userRes.rows[0].category,
                    image_url: userRes.rows[0].image_url,
                    notification: userRes.rows[0].notification_day,
                    notification_list: notification_list
                });
            }
        }
    } catch (err) {
        console.error(err.stack);
        res.send(err);
    }
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