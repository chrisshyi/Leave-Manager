const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Org = mongoose.model('Org', OrgSchema);