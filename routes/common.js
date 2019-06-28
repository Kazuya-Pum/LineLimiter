'use strict';
const axios = require('axios');

exports.handler = async (event) => {

    if (!event.headers.accesstoken) {
        throw new Error("Unauthorized");
    }
    const accessToken = event.headers.accesstoken;
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
            return res.data;
        }).catch(err => {
            return err;
        });
};