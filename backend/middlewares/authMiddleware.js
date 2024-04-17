const jwt = require('jsonwebtoken');
const USER = require('../models/User.js');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            const _id = decoded._id;
            req.user = await USER.findOne({_id}).select();
            next();
        }
        catch {
            res.status(500);
            throw new Error("Not authorized, token failed");
        }
    }

    if(!token) {
        console.log(req.body, req.headers);
        res.status(500);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect }