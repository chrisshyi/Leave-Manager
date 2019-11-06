const express = require("express");
const router = express.Router();
const { adminAuth } = require("../../middleware/admin_auth");
const { check, validationResult } = require("express-validator");
const Org = require('../../models/Org');

//@route  POST /api/orgs
//@desc   Adds a new organization
//@access site-admin only
router.post(
    "/",
    [
        adminAuth,
        check("name", "Organization must have a name")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        try {
            let newOrg = new Org({
                name: req.body.name
            });

            await newOrg.save();
            res.json(newOrg);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Server error'); 
        }
    }
);
