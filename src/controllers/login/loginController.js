const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../../db/models/userModel');
require('dotenv').config();

const loginUser = (request, response) => {
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
                        { expiresIn: "24h" }
                    );

                    // create refresh token
                    const refreshToken = jwt.sign(
                        {
                            userId: user._id,
                            email: user.email,
                        },
                        process.env.JWT_SCRECT_TOKEN_SECRECT,
                        { expiresIn: "7d" } // set the expiration as per your requirements
                    );

                    // store the refresh token in your database or cache
                    user.refreshToken = refreshToken;
                    user.save();

                    response.cookie('jwt', refreshToken, {
                        httpOnly: true, 
                        sameSite: 'None', 
                        secure: true, 
                        maxAge: 24 * 60 * 60 * 1000
                    })

                    // return success response with access and refresh tokens
                    
                    response.status(200).send({
                        message: "Login Successful",
                        user: user,
                        accessToken,
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
