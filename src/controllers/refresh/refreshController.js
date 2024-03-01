const jwt = require("jsonwebtoken");
const User = require('../../db/models/userModel');
const UserToken = require('../../db/models/userToken');


const refreshTokenHandler = (request, response) => {
    const cookies = request.cookies;

    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return response.sendStatus(401);
    }

    const accessToken = authorizationHeader.split(' ')[1];

    // Decode the access token to check its expiration
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRECT, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') {
            // Access token is expired, generate a new one
            generateNewTokens(accessToken, response);
        } else if (err) {
            // Access token is invalid
            response.sendStatus(403);
        } else {
            // Access token is valid, continue with the existing token
            continueWithExistingTokens(accessToken, response);
        }
    });
};

// Function to generate new access and refresh tokens
const generateNewTokens = (expiredAccessToken, response) => {
    // Find the user token by access token
    UserToken.findOne({ accessToken: expiredAccessToken })
        .then((userToken) => {
            if (!userToken) {
                return response.sendStatus(403); // User not found
            }

            // Find the user by user ID
            User.findOne({ _id: userToken.userId })
                .then((foundUser) => {
                    // Create new access token
                    const newAccessToken = jwt.sign(
                        {
                            userId: foundUser._id,
                            email: foundUser.email,
                        },
                        process.env.JWT_ACCESS_TOKEN_SECRECT,
                        { expiresIn: "10s" }
                    );

                    // Create new refresh token
                    const newRefreshToken = jwt.sign(
                        {
                            userId: foundUser._id,
                            email: foundUser.email,
                        },
                        process.env.JWT_REFRESH_TOKEN_SECRECT,
                        { expiresIn: "7d" }
                    );

                    // Update the user token with new tokens
                    UserToken.updateOne(
                        { accessToken: expiredAccessToken },
                        { accessToken: newAccessToken, refreshToken: newRefreshToken }
                    )
                        .then(() => {
                            // Send the new tokens in the response
                            response.status(200).send({
                                accessToken: newAccessToken,
                                refreshToken: newRefreshToken,
                                user: {
                                    id: foundUser._id,
                                    email: foundUser.email,
                                    roles: foundUser.roles,
                                    isEmailVerified: foundUser.isEmailVerified,
                                    isDeleted: foundUser.isDeleted,
                                    createdAt: foundUser.createdAt,
                                    updatedAt: foundUser.updatedAt,
                                },
                            });
                        })
                        .catch((error) => {
                            response.status(500).send({ error: 'Failed to update tokens' });
                        });
                })
                .catch((error) => {
                    response.status(500).send({ error: 'Failed to find user' });
                });
        })
        .catch((error) => {
            response.status(500).send({ error: 'Failed to find user token' });
        });
};

// Function to continue with existing tokens if access token is not expired
const continueWithExistingTokens = (accessToken, response) => {
    // Find the user token by access token
    UserToken.findOne({ accessToken: accessToken })
        .then((userToken) => {
            if (!userToken) {
                return response.sendStatus(403); // User not found
            }

            // Find the user by user ID
            User.findOne({ _id: userToken.userId })
                .then((foundUser) => {
                    // Send the existing tokens in the response
                    response.status(200).send({
                        accessToken,
                        refreshToken: userToken.refreshToken,
                        user: {
                            id: foundUser._id,
                            email: foundUser.email,
                            roles: foundUser.roles,
                            isEmailVerified: foundUser.isEmailVerified,
                            isDeleted: foundUser.isDeleted,
                            createdAt: foundUser.createdAt,
                            updatedAt: foundUser.updatedAt,
                        },
                    });
                })
                .catch((error) => {
                    response.status(500).send({ error: 'Failed to find user' });
                });
        })
        .catch((error) => {
            response.status(500).send({ error: 'Failed to find user token' });
        });
};

module.exports = { refreshTokenHandler };
