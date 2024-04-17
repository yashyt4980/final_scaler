const path = require("path");
const { extractData } = require("../services/extractTextPdf");
const { OCRPDF } = require("../services/ocr");
const { enrich } = require("../services/textEnrich");

const extractText = async (req, res) => {
  const url = req.body.url;
  const filename = req.body.filename;
  const { ok } = await OCRPDF(url, filename);
  const filePath = path.join(__dirname, '..', 'pdfs', filename);
  if (ok) {
    console.log(filePath);
    const data  = await extractData(`${filePath}`);
    // console.log(data);
    if (data) {
      res.send({
        ok: true,
        status: 200,
        data: {
            text: data.text,
            pages: data.pages, 
        },
      });
    } else {
      res.send({
        ok: false,
        status: 500,
        message: "Internal Server error!",
      });
    }
  } else {
    res.send({
        ok: false,
        status: 500,
    })
  }
};

const enrichText = async (req, res) => {
  const textInp = req.body.text;
  try {
    const enrichedText = await enrich(textInp);
    console.log("out", enrichedText);
    res.send({
      ok: true,
      status: 200,
      enrichedText,
    });
  } catch(Error) {
    res.status({
      code: 500,
      ok: false,
      text: null,
    });
  }
}
module.exports = { extractText, enrichText };
