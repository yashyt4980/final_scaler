const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Make email field unique
    },
    password: {
        type: String,
        required: true
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Document"
    }]
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
