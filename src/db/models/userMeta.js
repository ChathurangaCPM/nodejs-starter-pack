const mongoose = require('mongoose');

const userMetaSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
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

const UserMeta = mongoose.model('UserMeta', userMetaSchema);

module.exports = UserMeta;
