const mongoose = require('mongoose');

const PersonnelSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['site-admin', 'HR-admin'],
        default: 'HR-admin'
    },
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org'
    }
});

module.exports = Personnel = mongoose.model('Personnel', PersonnelSchema);