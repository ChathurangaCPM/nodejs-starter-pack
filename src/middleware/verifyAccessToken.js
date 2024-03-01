const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
        return res.sendStatus(401); // Unauthorized if no access token provided
    }

    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRECT, (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        // Pass the decoded token payload to the next middleware
        req.user = decoded;
        next();
    });
};

module.exports = { verifyAccessToken };