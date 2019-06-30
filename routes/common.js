'use strict';
const axios = require('axios');

exports.handler = async (req) => {

    if (req.session.userId) {
        console.log('session');
        return req.session.userId;
    }

    if (!req.headers.accesstoken) {
        throw new Error("Unauthorized");
    }
    const accessToken = req.headers.accesstoken;
    const url = `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`;

    return axios.get(url)
        .then(res => {
            if (!res.data.scope) {
                return Promise.reject(new Error("Not Authorized"));
            }
            return axios({
                method: "GET",
                url: 'https://api.line.me/v2/profile',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        }).then(res => {

            req.session.userId = res.data.userId;
            return res.data.userId;
        }).catch(err => {
            return err;
        });
};