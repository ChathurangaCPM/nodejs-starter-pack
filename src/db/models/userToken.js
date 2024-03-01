const mongoose = require('mongoose');

const userTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    userId: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    device: {
        type: String,
    },
    os: {
        type: String,
    },
    browser: {
        type: String,
    },
    ipAddress: {
        type: String,
    }
}, { timestamps: true });

const UserToken = mongoose.model('UserToken', userTokenSchema);

module.exports = UserToken;
