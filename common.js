'use strict';
const axios = require('axios');

exports.handler = async (req, res, next) => {
    try {
        if (req.session.userId) {
            console.log('session');
            return next();
        }

        if (!req.headers.accesstoken) {
            const err = new Error("Unauthorized");
            err.status = 403;
            throw err;
        }

        const accessToken = req.headers.accesstoken;
        const url = `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`;
        const oauth = await axios.get(url);

        if (!oauth.data.scope) {
            throw new Error("Not Authorized");
        }

        const userInfo = await axios({
            method: "GET",
            url: 'https://api.line.me/v2/profile',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        req.session.userId = userInfo.data.userId;
        next();
    } catch (err) {
        next(err);
    }
};