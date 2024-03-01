const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../../db/models/userModel');
const UserToken = require('../../db/models/userToken');
const useragent = require('useragent');

require('dotenv').config();

const loginUser = (request, response) => {

    const userAgentString = request.headers['user-agent'];
    const agent = useragent.parse(userAgentString);

    const device = agent.device.toString();
    const os = agent.os.toString();
    const browser = agent.toAgent();

    const ipAddress = request.ip;

    // check if email exists
    User.findOne({ email: request.body.email })
        // if email exists
        .then((user) => {
            // compare the password entered and the hashed password found
            bcrypt.compare(request.body.password, user.password)
                // if the passwords match
                .then((passwordCheck) => {
                    // check if password matches
                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: "Passwords do not match",
                            error,
                        });
                    }

                    // create JWT token
                    const accessToken = jwt.sign(
                        {
                            userId: user._id,
                            email: user.email,
                        },
                        process.env.JWT_ACCESS_TOKEN_SECRECT,
                        { expiresIn: "10s" }
                    );

                    // create refresh token
                    const refreshToken = jwt.sign(
                        {
                            userId: user._id,
                            email: user.email,
                        },
                        process.env.JWT_REFRESH_TOKEN_SECRECT,
                        { expiresIn: "7d" } // set the expiration as per your requirements
                    );


                    // Store the access token in the database
                    const accessTokenData = new UserToken({
                        userId: user._id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        device,
                        os,
                        browser,
                        ipAddress
                    });

                    accessTokenData.save();

                    response.status(200).send({
                        message: "Login Successful",
                        user: {
                            id: user._id,
                            email: user.email,
                            roles: user.roles,
                            isEmailVerified: user.isEmailVerified,
                            isDeleted: user.isDeleted,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            // __v: user.__v
                        },
                        accessToken,
                        refreshToken
                    });
                })
                // catch error if password does not match
                .catch((error) => {
                    response.status(400).send({
                        message: "Passwords do not match",
                        error,
                    });
                });
        })
        // catch error if email does not exist
        .catch((e) => {
            response.status(404).send({
                message: "Email not found",
                e,
            });
        });
};


const logoutUser = (request, response) => {
    const { refreshToken } = request.body;

    // Remove or invalidate the refresh token in your database or cache
    // In this example, let's assume you have a User model with a field named refreshToken
    User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } },
        { new: true }
    )
        .then((user) => {
            if (!user) {
                return response.status(404).send({
                    message: "User not found",
                });
            }

            response.status(200).send({
                message: "Logout Successful",
            });
        })
        .catch((error) => {
            response.status(500).send({
                message: "Internal Server Error",
                error,
            });
        });
};



module.exports = { loginUser, logoutUser };
