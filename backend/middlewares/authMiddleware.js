const jwt = require('jsonwebtoken');
const USER = require('../models/User.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            // console.log(decoded);
            const _id = decoded.id;
            req.user = await USER.findOne({_id}).select();
            // console.log(req.user);
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