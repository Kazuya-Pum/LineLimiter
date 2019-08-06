'use strict';
require('dotenv').config();
const format = require('util').format;
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp')

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    },
    fileFilter: function (req, file, callback) {
        if (!/^image\/.+$/i.test(file.mimetype)) {
            return callback(new Error("Only images are allowed"));
        }

        callback(null, true);
    }
}).single('file');

let storage;
let bucket;

try {
    storage = new Storage();
    bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
} catch (err) {
    console.error(err.stack);
}

async function upload(req, res, next) {
    try {
        if (!req.file) {
            return next();
        }

        const data = await sharp(req.file.buffer)
            .rotate()
            .resize(100, 100)
            .png()
            .toBuffer();

        const time = new Date();

        const uploadFile = bucket.file(req.session.userId + "/" + req.file.originalname.match(/^(.+)\..+$/)[1] + time.getTime() + ".png");
        const uploadStream = uploadFile.createWriteStream({
            public: true,
            contentType: 'image/png',
            gzip: 'auto',
            resumable: false,
            cacheControl: 'public, max-age=31536000',
            // metadata: {
            //     "Content-Length": data.length
            // }
        });

        uploadStream.on('error', (err) => {
            throw err;
        });

        uploadStream.on('finish', () => {
            req.file.cloudStoragePublicUrl = format(`https://storage.googleapis.com/${bucket.name}/${uploadFile.name}`);
            return next();
        });

        uploadStream.end(data);
    } catch (err) {
        next(err);
    }
}

function getUrl(req) {
    return (req.file) ? req.file.cloudStoragePublicUrl || '' : '';
}

async function deleteFile(url = '') {
    try {
        if (url == '') {
            return;
        }

        const fileName = url.match(`^https:\/\/storage.googleapis.com\/${bucket.name}\/(.+)$`);

        console.log(fileName);

        if (!fileName) {
            return;
        }

        return await storage
            .bucket(bucket.name)
            .file(fileName[1])
            .delete();
    } catch (err) {
        throw err;
    }
}

async function deleteUser(userId) {
    try {
        if (!userId) {
            return;
        }

        return await storage
            .bucket(bucket.name)
            .deleteFiles({
                'prefix': `${userId}/`
            });
    } catch (err) {
        throw err;
    }
}

module.exports = {
    multer,
    upload,
    deleteFile,
    deleteUser,
    getUrl
};