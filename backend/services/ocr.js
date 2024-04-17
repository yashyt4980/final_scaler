const https = require("https");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const API_KEY = process.env.API_KEY;

const OCRPDF = async (url,filename) => {
  return new Promise((resolve, reject) => {
    const SourceFileUrl = url;
    const Pages = "";
    const Password = "";
    const Language = "eng";
    const DestinationFile = path.join(__dirname, '..', 'pdfs', filename);
    const queryPath = `/v1/pdf/makesearchable`;
    const jsonPayload = JSON.stringify({
      name: path.basename(DestinationFile),
      password: Password,
      pages: Pages,
      url: SourceFileUrl,
      lang: Language,
    });

    const reqOptions = {
      host: "api.pdf.co",
      method: "POST",
      path: queryPath,
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(jsonPayload, "utf8"),
      },
    };

    const postRequest = https.request(reqOptions, (response) => {
      let responseData = '';

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        // Parse JSON response
        const data = JSON.parse(responseData);
        if (data.error == false) {
          // Download PDF file
          const file = fs.createWriteStream(DestinationFile);
          https.get(data.url, (response2) => {
            response2.pipe(file).on("close", () => {
              console.log(
                `Generated PDF file saved as "${DestinationFile}" file.`
              );
              status = true;
              resolve({
                ok: true,
              });
            });
          });
          
        } else {
          reject({
            ok: false,
            message:data.message
          });
        }
      });
    }).on("error", (e) => {
      // Request error
      reject(e);
    });

    // Write request data
    postRequest.write(jsonPayload);
    postRequest.end();
  });
  
};

module.exports = { OCRPDF };
