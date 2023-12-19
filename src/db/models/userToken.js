const mongoose = require('mongoose');

const userTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    // Add other user-related fields here
    // ...

    // Reference to User schema
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

module.exports = UserToken;
