'use strict';
require('dotenv').config();
const pg = require('pg');
const storage = require('./upload');

const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

pgClient.connect();

exports.delete = async (userId, id) => {
    if (userId == null || Number.isInteger(id)) {
        throw new Error("Illegal Parameter");
    }

    const selQuery = `SELECT id, image_url FROM ${userId}.food WHERE id = ${id} LIMIT 1`;
    const selRes = await pgClient.query(selQuery);

    if (selRes.rows[0].id == null) {
        throw new Error("undifined food");
    }

    const imageUrl = selRes.rows[0].image_url;
    
    const delQuery = `DELETE FROM ${userId}.food WHERE id = ${id}`;

    await Promise.all([
        pgClient.query(delQuery),
        (async () => {
            if (imageUrl) {
                await storage.deleteFile(imageUrl);
            }
            return;
        })()
    ]);
}

exports.client = pgClient;