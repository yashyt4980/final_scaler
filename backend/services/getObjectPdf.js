const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../client/S3_client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function getObject(filename) {
    const command = new GetObjectCommand({
        Bucket: `pdf-extract-ncoder`,
        Key: filename,
    })
    const url = await getSignedUrl(s3Client, command);
    // console.log(url);
    return url;
} 

module.exports = { getObject };