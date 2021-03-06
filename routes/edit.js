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

        let query = {};
        if (id) {

            const getOldImage = {
                text: `SELECT image_url FROM ${userId}.food WHERE id = $1 LIMIT 1`,
                values: [id]
            };

            const oldImage = (await pgClient.query(getOldImage)).rows[0].image_url || '';
            const postImageUrl = req.body.image_url || '';
            let imageUrl = storage.getUrl(req);

            if (!imageUrl) {
                // 新規アップロードがあればそれを使う
                if (!postImageUrl && oldImage) {
                    // 新規アップロードなし ＆ 表示画像なし & 登録済みあり ＝ 登録済みを消す
                    storage.deleteFile(oldImage);
                } else {
                    // 登録済みを再登録
                    imageUrl = oldImage;
                }
            }

            query = {
                text: `UPDATE ${userId}.food SET name = $1, limit_day = $2, image_url = $3, place = $4, memo = $5, category = $6, notification_day = $7, enabled = TRUE WHERE id = $8`,
                values: [req.body.name, date.toFormat('YYYY-MM-DD'), imageUrl, req.body.place, memo, req.body.category, notification, id]
            };
        } else {
            query = {
                text: `INSERT INTO ${userId}.food (name, limit_day, image_url, place, memo, category, notification_day) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                values: [req.body.name, date.toFormat('YYYY-MM-DD'), storage.getUrl(req), req.body.place, memo, req.body.category, notification]
            };
        }

        await pgClient.query(query);
        console.log("edit food");
        res.sendStatus(200).end();

    } catch (err) {
        next(err);
    }
});

// Ajax
router.post('/get', token.handler, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const centerQuery = {
            text: 'SELECT notification_day FROM center.user WHERE user_id = $1',
            values: [userId]
        };
        const centerRes = await pgClient.query(centerQuery);
        const notification_list = centerRes.rows[0].notification_day;

        const id = Number(req.body.id || 0);
        const preset = Number(req.body.preset || 0);

        if (preset) {
            const presetQuery = {
                text: 'SELECT * FROM center.preset WHERE id = $1',
                values: [preset]
            };

            const presetRes = (await pgClient.query(presetQuery)).rows[0];

            let limitStr = '';
            if (Number(presetRes.limit_term || 0)) {
                const today = new Date();
                const limitDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + presetRes.limit_term);
                limitStr = limitDay.toFormat('YYYY-MM-DD');
            }

            const notification = (notification_list.length > 0) ? [notification_list[0]] : [];

            res.json({
                notification_list: notification_list,
                name: presetRes.name,
                place: presetRes.place || '',
                category: presetRes.category || 3,
                limit_day: limitStr,
                notification: notification
            })

        } else if (!id) {
            res.json({
                notification_list: notification_list
            });
        } else {
            const query = {
                text: `SELECT name, limit_day, place, memo, category, image_url, notification_day FROM ${userId}.food WHERE id = $1`,
                values: [id]
            };

            const userRes = await pgClient.query(query);
            if (userRes.rows) {
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
        next(err);
    }
});

// 入力
router.get('/', function (req, res) {

    let title = '新規登録';
    if (req.query.id) {
        title = '編集';
    }

    res.render('edit', {
        title: title
    });
});

module.exports = router;