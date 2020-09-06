const mongoose = require('mongoose');

const reset_password_token_schema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        },
        access_token: {
            type: String
        },
        is_valid: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

const token_details = mongoose.model('Token', reset_password_token_schema);

module.exports = token_details;