const express = require("express");
const router = express.Router();
const tokenAuth = require("../../middleware/token_auth");
const {
    leaveAddAuth,
    leaveModDeleteAuth
} = require("../../middleware/leave_auth");
const {Leave, leaveTypes} = require("../../models/Leave");
const {check, validationResult} = require("express-validator");
const {getLeaveInfoAuth} = require("../../middleware/leave_auth");
const {getPersonnelAuth} = require('../../middleware/personnel_auth');
const moment = require('moment');

// @route POST /api/leaves
// @desc  Adds a new leave
// @access Accessible to site-admins, and HR-admins of the same organization as the personnel
//         the leave pertains to
router.post(
    "/",
    [
        tokenAuth,
        leaveAddAuth,
        check("org", "Org id must be provided")
            .not()
            .isEmpty(),
        check("leaveType", "Leave type must be provided")
            .not()
            .isEmpty(),
        check("leaveType", "Leave type not allowed").isIn(leaveTypes),
        check("personnel", "Personnel id must be provided")
            .not()
            .isEmpty(),
        check("scheduled", "'scheduled' must be a boolean")
            .isBoolean()
            .optional(),
        check("duration", "Duration must be provided")
            .not()
            .isEmpty(),
        check("duration", "Duration must be a number between 4.5 and 24")
            .isNumeric()
            .toFloat(),
        check("originalDate", "Original date must be a valid date")
            .isISO8601({strict: true})
            .toDate()
            .optional({
                nullable: true,
                checkFalsy: true
            }),
        check("scheduledDate", "Scheduled date must be a valid date")
            .isISO8601({strict: true})
            .toDate()
            .optional({
                nullable: true,
                checkFalsy: true
            })
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
        if (typeof originalDate !== 'undefined') leaveFields.originalDate = originalDate;
        if (typeof scheduledDate !== 'undefined') leaveFields.scheduledDate = scheduledDate;
        if (typeof scheduled !== 'undefined') leaveFields.scheduled = scheduled;
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
router.get("/", tokenAuth, async (req, res) => {
    let baseQuery;
    if (req.personnel.role === "reg-user") {
        baseQuery = Leave.find({
            personnel: req.personnel.id
        });
    } else if (req.personnel.role === "HR-admin") {
        baseQuery = Leave.find({
            org: req.personnel.orgId
        });
    } else {
        baseQuery = Leave.find({});
    }
    const queries = req.query;
    let startDate, endDate;
    if (Object.keys(queries).length !== 0) {
        if (queries.year) {
            // queries.year is a string!
            const year = parseInt(queries.year);
            startDate = moment().year(year).startOf("year");
            endDate = moment().year(year).add(1, "years").startOf("year");
            if (queries.month) {
                const month = parseInt(queries.month);
                startDate.month(month - 1).startOf("month");
                endDate.year(year).month(month - 1).add(1, "months").startOf("month");
            }
            if (queries.day) {
                const day = parseInt(queries.day);
                startDate.date(day).startOf("date");
                endDate.date(day).add(1, "days").startOf("date")
            }
        }
    }

    let finalQuery = baseQuery;
    if (startDate && endDate) {
        startDate = startDate.toDate();
        endDate = endDate.toDate();
        finalQuery = baseQuery
            .and([
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
            ])
            .populate("personnel", "name role");
    }
    const queryResult = await finalQuery;
    res.json({leaves: queryResult});
});
// @route PUT /api/leaves/:leaveId
// @desc  Modifies an existing leave
// @access Accessible to site-admins, and HR-admins of the same organization as the personnel
//         the leave pertains to
router.put(
    "/:leaveId",
    [
        tokenAuth,
        leaveModDeleteAuth,
        check("leaveType", "Leave type not allowed")
            .isIn(leaveTypes)
            .optional(),
        check("personnel", "Cannot modify the personnel")
            .not()
            .exists(),
        check("scheduled", "'scheduled' must be a boolean")

            .isBoolean()
            .optional(),
        check("duration", "Duration must be a number between 4.5 and 24")

            .isNumeric()
            .toFloat()
            .optional(),
        check("originalDate", "Original date must be a valid date")
            .isISO8601({strict: true})
            .toDate()
            .optional({
                nullable: true,
                checkFalsy: true
            }),
        check("scheduledDate", "Scheduled date must be a valid date")
            .isISO8601({strict: true})
            .toDate()
            .optional({
                nullable: true,
                checkFalsy: true
            })
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
        if (typeof leaveType !== 'undefined') leaveFields.leaveType = leaveType;
        if (typeof duration !== 'undefined') leaveFields.duration = duration;
        if (typeof originalDate !== 'undefined') leaveFields.originalDate = originalDate;
        if (typeof scheduledDate !== 'undefined') leaveFields.scheduledDate = scheduledDate;
        if (typeof scheduled !== 'undefined') leaveFields.scheduled = scheduled;
        try {
            const modifiedLeave = await Leave.findByIdAndUpdate(
                req.params.leaveId,
                leaveFields,
                {
                    new: true,
                    runValidators: true
                }
            );
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
            return res.status(500).json({
                msg: error
            });
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
// @route GET /api/leaves/available/{personnel_id}
// @desc  Retrives unscheduled leaves for a given personnel
// @access private to site-admins and HR-admins of the same organization
router.get("/available/:personnelId", [tokenAuth, getPersonnelAuth], async (req, res) => {
    const leaves = await Leave.find({
        personnel: res.data['personnel'].id,
        scheduled: false
    });
    return res.json({
        personnel: res.data['personnel'],
        leaves
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
        };
        res.json(leaveData);
    }
);

module.exports = router;
