const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../client/S3_client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
async function getObject(filename) {
    const command = new GetObjectCommand({
        Bucket: `${process.env.BUCKET_URL}`,
        Key: filename,
    })
    const url = await getSignedUrl(s3Client, command);
    return url;
} 

module.exports = { getObject };