const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const tokenAuth = require("../../middleware/token_auth");
const {
    leaveAddAuth,
    leaveModDeleteAuth
} = require("../../middleware/leave_auth");
const { Leave, leaveTypes } = require("../../models/Leave");
const { check, validationResult } = require("express-validator");
const { getLeaveInfoAuth } = require("../../middleware/leave_auth");

// @route POST /api/leaves
// @desc  Adds a new leave
// @access Accessible to site-admins, and HR-admins of the same organization as the personnel
//         the leave pertains to
router.post(
    "/",
    [
        tokenAuth,
        leaveAddAuth,
        check("org", "Org id must be provided").not().isEmpty(),
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
            duration,
            org
        } = req.body;

        const leaveFields = {};
        leaveFields.leaveType = leaveType;
        leaveFields.personnel = personnel;
        leaveFields.org = org;
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

// @route GET /api/leaves?year={year}&month={month}&day={day}
// @desc  Gets leaves with optional filters. 
// @access Public. Regular users will only see their own leaves. HR-admins see the leaves of their 
//         organization. Site-admins see all leaves.
router.get(
    "/",
    tokenAuth,
    async (req, res) => {
        let baseQuery;
        if (req.personnel.role === 'reg-user') {
            baseQuery = Leave.find({
                personnel: req.personnel.id
            });
        } else if (req.personnel.role === 'HR-admin') {
            baseQuery = Leave.find({
                org: req.personnel.orgId
            });
        } else {
            baseQuery = Leave.find({});
        }
        const queries = req.query;
        let startDate, endDate;
        if (Object.keys(queries).length !== 0) {
            if (queries.year) {// queries.year is a string!
                const year = parseInt(queries.year);
                startDate = new Date(year, 0, 1);
                endDate = new Date(year+ 1, 0, 1);
                if (queries.month) {
                    const month = parseInt(queries.month);
                    startDate.setMonth(month - 1);
                    endDate.setMonth(month);
                    endDate.setFullYear(year);
                }
                if (queries.day) {
                    const day = parseInt(queries.day);
                    startDate.setDate(day);
                    endDate.setDate(day + 1);
                }
            }
        }
        let finalQuery = baseQuery;
        if (startDate && endDate) {
            finalQuery = baseQuery.and([
                {
                    scheduledDate: {
                        $exists: true
                    }
                },
                {
                    scheduledDate: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            ]).sort({
                personnel: 'asc'
            }).populate('personnel', 'name role');
        }
        const queryResult = await finalQuery;
        res.json({ leaves: queryResult });
    }
);
// @route PUT /api/leaves/:leaveId
// @desc  Modifies an existing leave
// @access Accessible to site-admins, and HR-admins of the same organization as the personnel
//         the leave pertains to
router.put(
    "/:leaveId",
    [
        tokenAuth,
        leaveModDeleteAuth,
        check("leaveType", "Leave type not allowed").optional().isIn(leaveTypes),
        check("personnel", "Cannot modify the personnel").not().exists(),
        check("scheduled", "'scheduled' must be a boolean")
            .optional()
            .isBoolean(),
        check("duration", "Duration must be a number between 4.5 and 24")
            .optional()
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
        // The personnel CANNOT be changed
        const {
            leaveType,
            scheduled,
            originalDate,
            scheduledDate,
            duration
        } = req.body;

        const leaveFields = {};
        if (leaveType) leaveFields.leaveType = leaveType;
        if (duration) leaveFields.duration = duration;
        if (originalDate) leaveFields.originalDate = originalDate;
        if (scheduledDate) leaveFields.scheduledDate = scheduledDate;
        if (scheduled) leaveFields.scheduled = scheduled;
        try {
            const modifiedLeave = await Leave.findByIdAndUpdate(req.params.leaveId, leaveFields, {
                new: true,
                runValidators: true
            });
            return res.json({
                leaveType: modifiedLeave.leaveType,
                duration: modifiedLeave.duration,
                originalDate: modifiedLeave.originalDate,
                scheduledDate: modifiedLeave.scheduledDate,
                scheduled: modifiedLeave.scheduled,
                personnel: modifiedLeave.personnel.toString()
            });
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
    const {
        leaveType,
        personnel,
        scheduled,
        originalDate,
        scheduledDate,
        duration
    } = leave;
    return res.json({
        leaveType,
        personnel,
        scheduled,
        originalDate,
        scheduledDate,
        duration
    });
});

//@route DELETE /api/leaves/{leaveId}
//@desc Deletes an existing leave
//@access Private to site admins and HR-admins of the same organization
router.delete(
    "/:leaveId",
    [tokenAuth, leaveModDeleteAuth],
    async (req, res) => {
        const leave = await Leave.findByIdAndDelete(req.params.leaveId);
        const {
            leaveType,
            personnel,
            scheduled,
            originalDate,
            scheduledDate,
            duration
        } = leave;
        const leaveData = {
            leaveType,
            personnel: personnel.toString(),
            scheduled,
            originalDate,
            scheduledDate,
            duration
        }
        res.json(leaveData);
    }
);

module.exports = router;