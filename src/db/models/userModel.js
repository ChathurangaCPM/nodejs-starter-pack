const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
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
        // Reference to UserMeta schema
        userMeta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserMeta',
        },
    },
    { timestamps: true } // Adding timestamps option to enable automatic createdAt and updatedAt fields
);

const User = mongoose.model('User', userSchema);

module.exports = User;
