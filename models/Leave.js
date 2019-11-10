const mongoose = require("mongoose");

const leaveTypes = ["慰假", "預假", "補假", "例假", "公假", "外散", "外宿"];

const LeaveSchema = new mongoose.Schema({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Org",
        required: true
    },
    leaveType: {
        type: String,
        required: true,
        enum: leaveTypes
    },
    personnel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Personnel",
        required: true
    },
    scheduled: {
        type: Boolean,
        default: false
    },
    originalDate: {
        type: Date
    },
    scheduledDate: {
        type: Date
    },
    // duration of the leave, in hours
    duration: {
        type: Number,
        required: true,
        min: 4.5,
        max: 24
    }
});

module.exports.Leave = mongoose.model("Leave", LeaveSchema);
module.exports.leaveTypes = leaveTypes;
