const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },
    roles: {
        type: String,
        enum: ['admin', 'user', 'editor'],
        default: 'user',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        unique: true,
    },
    accessToken: {
        type: String,
        unique: true,
    },
    // Reference to UserMeta schema
    userMeta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMeta',
    },

});

const User = mongoose.model('User', userSchema);

module.exports = User;