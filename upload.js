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

const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || 'linelimiter.appspot.com');

async function upload(req, res, next) {
    try {
        if (!req.file) {
            return next();
        }

        const data = await sharp(req.file.buffer)
            .resize(100, 100)
            .png()
            .toBuffer();

        const uploadFile = bucket.file(req.session.userId + "/" + req.file.originalname);
        const uploadStream = uploadFile.createWriteStream({
            public: true,
            contentType: 'image/png',
            gzip: 'auto',
            resumable: false,
            //metadata: {
            //    cacheControl: 'public, max-age=31536000',
            //}
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
    return (req.file) ? req.file.cloudStoragePublicUrl : '';
}

async function deleteFile(url) {

    const fileName = url.match(/^https:\/\/storage.googleapis.com\/.+\/(.+)$/);

    if (!fileName[1]) {
        return;
    }

    return await storage
        .bucket(bucket.name)
        .file(filename[1])
        .delete();
}

module.exports = {
    multer,
    upload,
    deleteFile,
    getUrl
};