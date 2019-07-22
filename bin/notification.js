'use strict';

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

module.exports = async function (req, res, next) {

    const day = moment();
    const cemterQuery = `SELECT user_id FROM center.user WHERE notification = ${day.hours()}`;

    pgClient.query(cemterQuery)
        .then(res => {
            if (!res.rows) {
                throw new Error('No User');
            }

            res.rows.forEach(element => {
                const query = `SELECT id, name, image_url, limit_day FROM ${element.user_id}.food WHERE (limit_day::date - '${day.format('YYYY-MM-DD')}'::date)::int2 = ANY(notification_day)`;
                pgClient.query(query)
                    .then(res => {

                        if (!res.rows) {
                            throw new Error('No item');
                        }

                        let columns = [];
                        for (let i = 0; i < res.rows.length; ++i) {
                            const image = res.rows[i].image_url || 'https://drive.google.com/uc?authuser=0&id=1rgKd8GG3Q0FRv1Agbfvpl2WCejhS-gKH&export=download';

                            columns.push(
                                {
                                    thumbnailImageUrl: image,
                                    title: res.rows[i].name,
                                    text: moment(res.rows[i].limit_day).format('YYYY-MM-DD'),
                                    actions: [
                                        {
                                            type: "uri",
                                            label: "編集",
                                            uri: `line://app/1576982999-LQW5ZXBv?id=${res.rows[i].id}`
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

                        console.log(JSON.stringify(columns));

                        client.pushMessage(element.user_id, message)
                            .then(() => {
                                console.log('success');
                            })
                            .catch((err) => {
                                console.log(err.stack);
                            });
                    })
                    .catch(err => console.log(err.stack))
            });
        })
        .catch(err => console.log(err.stack))
};
