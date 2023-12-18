const jwt = require("jsonwebtoken");
const User = require('../../db/models/userModel');


const logoutHandler = (request, response) => {
    // on client also delete the accessToken

    const cookies = request.cookies;

    if (!cookies?.jwt) return response.sendStatus(204); // no content to send back

    const refreshToken = cookies.jwt;

    console.log('refreshToken ====', refreshToken);

    // if refreshToken in the DB (user)
    // check refreshToken
    User.findOne({ refreshToken: refreshToken })
        // get refreshToken related user
        .then((user) => {
            // Update the user refreshToken
            user.refreshToken = 1;
            user.save();
            
            // clear JWT cookie
            response.clearCookie('jwt', { httpOnly: true });

            response.sendStatus(204);

        })
        // catch error if refreshToken does not exist
        .catch((e) => {
            response.status(403).send({
                e,
            });
        });
};

module.exports = { logoutHandler };