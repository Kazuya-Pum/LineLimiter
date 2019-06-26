'use strict';
require('dotenv').config();
const pg = require('pg');

const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

pgClient.connect();

exports.client = pgClient;