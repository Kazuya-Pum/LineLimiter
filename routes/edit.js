'use strict';
const express = require('express');
const router = express.Router();
const pgClient = require('../database').client;

// 登録
router.post('/:id', function (req, res) {
    const id = Number(req.params.id);
    const userId = req.body.userId;

    const queue = `UPDATE ${userId}.food SET name = ${req.body.name}, limit_day = ${req.body.limitDay}, image_url = ${req.body.imageUrl}, place = ${req.body.place}, memo = ${req.body.memo}, category = ${req.body.category} WHERE id = ${id}`;

    pgClient.query(queue)
        .then(res => console.log("edit food"))
        .catch(err => console.error(err.stack))

    res.render('edit', { title: 'test' });
});

// 新規登録
router.post('/', function (req, res) {
    console.log(req.body.limit);
    res.render('edit', {
        title: 'test'
    });
});

// 編集
router.get('/:id', function (req, res) {
    res.render('edit', { title: '編集' });
});

// カテゴリ
router.get('/category/:value', function (req, res) {
    res.render('edit', { title: 'カテゴリから登録' });
});

// 新規
router.get('/', function (req, res) {

    res.render('edit', { title: '新規登録' });
});

module.exports = router;