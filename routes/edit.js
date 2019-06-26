'use strict';
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;

// 登録
router.post('/:id', function (req, res) {
    const id = Number(req.params.id);
    const userId = req.body.userId;

    const query = `UPDATE ${userId}.food SET name = ${req.body.name}, limit_day = ${req.body.limitDay}, image_url = ${req.body.imageUrl}, place = ${req.body.place}, memo = ${req.body.memo}, category = ${req.body.category} WHERE id = ${id}`;

    pgClient.query(query)
        .then(res => console.log("edit food"))
        .catch(err => console.error(err.stack))

    res.render('edit', {
        title: '編集',
        name: req.body.name,
        limit_day: req.body.limitDay,
        place: req.body.place,
        memo: req.body.memo,
        category: req.body.category,
        image_url: req.body.imageUrl
    });
});

// 新規登録
router.post('/', function (req, res) {
    const userId = req.body.userId;

    const query = `INSERT INTO ${userId}.food (name, limit_day, image_url, place, memo, category) VALUES ('${req.body.name}', '${req.body.limitDay}', '${req.body.imageUrl}', '${req.body.place}', '${req.body.memo}', '${req.body.category}')`;

    console.log(query);

    pgClient.query(query)
        .then(res => console.log("add food"))
        .catch(err => console.error(err.stack))

    res.render('edit', {
        title: '追加',
        name: req.body.name,
        limit_day: req.body.limitDay,
        place: req.body.place,
        memo: req.body.memo,
        category: req.body.category,
        image_url: req.body.imageUrl
    });
});

// 編集
router.get('/:id', function (req, res) {
    res.render('edit', {
        title: '編集',
        name: '',
        limit_day: '',
        place: '',
        memo: '',
        category: '',
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

// 新規
router.get('/', function (req, res) {

    res.render('edit', {
        title: '新規登録',
        name: null,
        limit_day: null,
        place: null,
        memo: null,
        category: null,
        image_url: null
    });
});

module.exports = router;