const express = require("express");
const router = express.Router();
const tokenAuth = require("../../middleware/token_auth");
const { leaveAddAuth, leaveModAuth } = require("../../middleware/leave_auth");
const { Leave, leaveTypes } = require("../../models/Leave");
const { check, validationResult } = require("express-validator");
const { hrAdminAuth } = require("../../middleware/hr_auth");
const { getLeaveInfoAuth } = require("../../middleware/leave_auth");

// @route POST /api/leaves
// @desc  Adds a new leave
// @access private
router.post(
    "/",
    [
        tokenAuth,
        hrAdminAuth,
        check("leaveType", "Leave type must be provided")
            .not()
            .isEmpty(),
        check("leaveType", "Leave type not allowed").isIn(leaveTypes),
        check("personnel", "Personnel id must be provided")
            .not()
            .isEmpty(),
        check("scheduled", "'scheduled' must be a boolean")
            .optional()
            .isBoolean(),
        check("duration", "Duration must be provided")
            .not()
            .isEmpty(),
        check("duration", "Duration must be a number between 4.5 and 24")
            .isNumeric()
            .toFloat(),
        check("originalDate", "Original date must be a valid date")
            .optional()
            .isISO8601({ strict: true })
            .toDate(),
        check("scheduledDate", "Scheduled date must be a valid date")
            .optional()
            .isISO8601({ strict: true })
            .toDate()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            leaveType,
            personnel,
            scheduled,
            originalDate,
            scheduledDate,
            duration
        } = req.body;

        const leaveFields = {};
        leaveFields.leaveType = leaveType;
        leaveFields.personnel = personnel;
        leaveFields.duration = duration;
        if (originalDate) leaveFields.originalDate = originalDate;
        if (scheduledDate) leaveFields.scheduledDate = scheduledDate;
        if (scheduled) leaveFields.scheduled = scheduled;
        try {
            let newLeave = new Leave(leaveFields);
            await newLeave.save();
            return res.json(leaveFields);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server error");
        }
    }
);

// @route GET /api/leaves/{leave_id}
// @desc  Retrives information about an existing leave
// @access private to site-admin, the personnel to which the leave belongs, and the HR-admin of the same organization
router.get("/:leaveId", [tokenAuth, getLeaveInfoAuth], async (req, res) => {
    const leave = await Leave.findById(req.params.leaveId);
    const {leaveType, personnel, scheduled, originalDate, scheduledDate, duration} = leave;
    return res.json({
        leaveType,
        personnel,
        scheduled,
        originalDate,
        scheduledDate,
        duration
    });
});

module.exports = router;
