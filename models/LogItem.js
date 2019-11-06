const mongoose = require('mongoose');

const LogItemSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    logType: {
        type: String,
        required: true,
        enum: ['addition', 'removal', 'modification']
    },
    msg: {
        type: String,
        required: true
    }
})

module.exports = LogItem = mongoose.model('LogItem', LogItemSchema);