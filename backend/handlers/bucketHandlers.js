const { getObject } = require("../services/getObjectPdf");
const { putObject } = require("../services/setObjectPdf");
const getUrl = async(req,res) => {
    const url = await putObject(req.body.filename);
    if(!url) {
        res.send({
            status: 500,
            message: 'Internal Server error!',
        });
    } else {
        res.send({
            status: 200,
            uploadUrl: url,
        });
    }
}


const getFileUrl = async(req,res) => {
    const key = req.body.key;
    if(!key) {
        res.send({
            ok: false,
            status: 500,
            message: "Key not provided",
        });
        return;
    }
    const resp = await getObject(key);
    if(resp) {
        res.send({
            ok: true,
            status: 200,
            url:resp
        });
    } else {
        res.send({
            ok: false,
            status: 404,
            url: null,
        });
    }
    
}
module.exports = { getUrl, getFileUrl }