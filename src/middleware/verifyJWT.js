const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    console.log("authHeader", authHeader);

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRECT,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.user = decoded;
            next();
        }
    )
}

module.exports = verifyJWT;