const jwt = require("jsonwebtoken");
const User = require('../../db/models/userModel');
const refreshTokenHandler = (request, response) => {
    const cookies = request.cookies;
    // const authorizationHeader = request.headers['authorization'];
    
    // if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    //     return response.sendStatus(401);
    // }

    // const accessToken = authorizationHeader.split(' ')[1];

    console.log('req.cookies.sessionCookie ===', request);

    const refreshToken = cookies.jwt;

    // check refreshToken
    User.findOne({ refreshToken: refreshToken })
        .then((user) => {
            if (!user) {
                return response.sendStatus(403); // User not found
            }

            // verify refresh token
            jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRECT,
                (err, decoded) => {
                    if (err) return response.sendStatus(403); // Invalid refresh token

                    // create new access token
                    const accessToken = jwt.sign(
                        {
                            userId: user._id,
                            email: user.email,
                        },
                        process.env.JWT_ACCESS_TOKEN_SECRECT,
                        { expiresIn: "25m" }
                    );

                    const userRoles = user.roles;

                    response.status(200).send({ accessToken, userRoles });
                }
            );
        })
        .catch((e) => {
            response.status(403).send({
                e,
            });
        });
};

module.exports = { refreshTokenHandler };