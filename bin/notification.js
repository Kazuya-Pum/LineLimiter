'use strict';

require('dotenv').config();
const line = require('@line/bot-sdk');
const moment = require('moment-timezone');
const pgClient = require('../database').client;

moment.tz.setDefault("Asia/Tokyo");

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

// create LINE SDK client
const client = new line.Client(config);

module.exports = async () => {
    try {
        const day = moment();
        const centerQuery = `SELECT user_id FROM center.user WHERE notification = ${day.hours()}`;
        const centerRes = await pgClient.query(centerQuery);

        if (centerRes.rows.length == 0) {
            throw new Error('No User');
        }

        Promise.all(centerRes.rows.map(async (value) => {
            const userQuery = `SELECT id, name, image_url, limit_day FROM ${value.user_id}.food WHERE enabled = TRUE AND (limit_day::date - '${day.format('YYYY-MM-DD')}'::date)::int2 = ANY(notification_day)`;
            const userRes = await pgClient.query(userQuery);

            if (userRes.rows.length == 0) {
                return;
            }

            let columns = [];
            for (let i = 0; i < userRes.rows.length; ++i) {
                const image = userRes.rows[i].image_url || 'https://drive.google.com/uc?authuser=0&id=1rgKd8GG3Q0FRv1Agbfvpl2WCejhS-gKH&export=download';

                columns.push(
                    {
                        thumbnailImageUrl: image,
                        title: userRes.rows[i].name,
                        text: moment(userRes.rows[i].limit_day).format('YYYY-MM-DD'),
                        actions: [
                            {
                                type: "uri",
                                label: "編集",
                                uri: `line://app/1576982999-LQW5ZXBv?id=${userRes.rows[i].id}`
                            }
                        ]
                    });
            }

            const message = {
                type: 'template',
                altText: '賞味期限が近づいています！',
                template: {
                    type: 'carousel',
                    columns: columns
                }
            };

            client.pushMessage(value.user_id, message)
                .then(() => {
                    console.log('success');
                })
                .catch((err) => {
                    console.log(err.stack);
                });
        }));
    } catch (err) {
        console.error(err.message);
    }
};
