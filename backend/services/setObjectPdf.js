const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../client/S3_client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function putObject(filename) {
    const command = new PutObjectCommand({
        Bucket: `pdf-extract-ncoder`,
        Key: `${filename.split(".")[0]}.pdf`,
        ContentType: `pdf`
    })
    const url = await getSignedUrl(s3Client, command);
    return url;
} 

module.exports = { putObject };