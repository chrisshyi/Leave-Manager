const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const Personnel = require("../../models/Personnel");
const { Leave } = require("../../models/Leave");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/token_auth");

const {
    getPersonnelAuth,
    addOrEditPersonnelAuth
} = require("../../middleware/personnel_auth");

const extractDateString = date => {
    if (date === null || typeof date === 'undefined') {
        return ""
    } else {
        let dateStr = date.getDate();
        dateStr = dateStr >= 10 ? dateStr : `0${dateStr}`;
        return `${date.getFullYear()}-${date.getMonth() + 1}-${dateStr}`;
    }
}
// @route  POST api/personnel
// @desc   Register new personnel
// @access site-admin and HR-Admin only
router.post(
    "/",
    [
        auth,
        addOrEditPersonnelAuth,
        check("name", "Name is required")
            .not()
            .isEmpty(),
        check("email", "please enter a proper email").isEmail(),
        check(
            "password",
            "please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
        check("title", "Title is required")
            .not()
            .isEmpty(),
        check("role", "Role is required")
            .not()
            .isEmpty(),
        check(
            "role",
            "Role must be either HR-admin or site-admin or reg-user"
        ).isIn(["HR-admin", "site-admin", "reg-user"]),
        check("org", "The personnel's organization must be specified")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const { name, email, password, title, role, org } = req.body;
        try {
            let personnel = await Personnel.findOne({
                email
            });
            if (personnel) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "Personnel already exists"
                        }
                    ]
                });
            }

            personnel = new Personnel({
                email,
                name,
                password,
                role,
                title,
                org
            });
            const salt = await bcrypt.genSalt(10);
            personnel.password = await bcrypt.hash(password, salt);

            await personnel.save();
            const payload = {
                personnel: {
                    id: personnel.id
                }
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err);
            res.status(500).send("server error");
        }
    }
);
// @route  GET api/personnel
// @desc   Gets personnel. Site-admins can retrieve all personnel, HR-admins can
//         retrieve all personnel from the same organization. regular users can
//         only retrieve themselves
// @access Accessible to all authenticated personnel
router.get("/", auth, async (req, res) => {
    let query;
    if (req.personnel.role === "reg-user") {
        query = Personnel.find({ _id: req.personnel.id });
    } else if (req.personnel.role === "HR-admin") {
        query = Personnel.find({
            org: req.personnel.orgId
        });
    } else {
        query = Personnel.find({});
    }
    query = query.populate("org", "name");
    const personnelArr = await query.sort({
        name: "asc"
    });
    res.json({ personnel: personnelArr });
});
// @route  GET api/personnel/{personnelId}
// @desc   Get personnel information
// @access Private to site-admin, the personnel in question, and HR-admins of the same organization
router.get("/:personnelId", [auth, getPersonnelAuth], async (req, res) => {
    const personnel = res.data.personnel;
    const personnelData = {
        email: personnel.email,
        name: personnel.name,
        title: personnel.title,
        role: personnel.role,
        org: personnel.org.toString()
    };
    const ObjectId = mongoose.Types.ObjectId;
    const personnelLeaves = await Leave.find({
        personnel: new ObjectId(req.params.personnelId)
    }).sort("scheduledDate");
    let personnelLeaveData = personnelLeaves.map(leave => {
        return {
            leaveType: leave.leaveType,
            leaveURL: `/api/leaves/${leave.id}`,
            personnel: leave.personnel.toString(),
            scheduled: leave.scheduled,
            originalDate: extractDateString(leave.originalDate),
            scheduledDate: extractDateString(leave.scheduledDate),
            duration: leave.duration,
            id: leave.id
        };
    });
    personnelData.leaves = personnelLeaveData;
    res.json({ personnel: personnelData });
});
// @route  PUT api/personnel
// @desc   Edit existing personnel
// @access site-admin and HR-Admin only. HR-admins may only edit personnel in their organization.
router.put(
    "/:personnelId",
    [
        auth,
        addOrEditPersonnelAuth,
        check("email", "please enter a proper email")
            .optional()
            .isEmail(),
        check("password", "please enter a password with 6 or more characters")
            .optional()
            .isLength({ min: 6 }),
        check("role", "Role must be either HR-admin or site-admin or reg-user")
            .optional()
            .isIn(["HR-admin", "site-admin", "reg-user"])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: "validation failed!",
                errors: errors.array()
            });
        }
        const updateData = {};
        const { name, email, password, title, role } = req.body;
        if (typeof name !== "undefined") updateData.name = name;
        if (typeof email !== "undefined") updateData.email = email;
        if (typeof password !== "undefined") updateData.password = password;
        if (typeof title !== "undefined") updateData.title = title;
        if (typeof role !== "undefined") updateData.role = role;

        const { personnelId } = req.params;
        try {
            let personnel = await Personnel.findByIdAndUpdate(
                personnelId,
                updateData
            );
            if (!personnel) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "Personnel doesn't exist"
                        }
                    ]
                });
            }
            res.json(personnel);
        } catch (err) {
            console.log(err);
            res.status(500).send("server error");
        }
    }
);
// @route  DELETE api/personnel
// @desc   Edit existing personnel
// @access site-admin and HR-Admin only. HR-admins may only edit personnel in their organization.
router.delete(
    "/:personnelId",
    [auth, addOrEditPersonnelAuth],
    async (req, res) => {
        const { personnelId } = req.params;
        try {
            let personnel = await Personnel.findByIdAndDelete(personnelId);
            const ObjectId = mongoose.Types.ObjectId;
            await Leave.deleteMany({
                personnel: new ObjectId(personnelId)
            });
            if (!personnel) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "Personnel doesn't exist"
                        }
                    ]
                });
            }
            res.json(personnel);
        } catch (err) {
            console.log(err);
            res.status(500).send("server error");
        }
    }
);

module.exports = router;
