'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('err', { error: 'test' });
});

module.exports = router;