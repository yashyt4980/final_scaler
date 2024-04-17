const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();
const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_KEY_ID,
    }
});

module.exports = { s3Client };