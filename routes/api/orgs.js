const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { adminAuth } = require("../../middleware/admin_auth");
const { check, validationResult } = require("express-validator");
const Org = require('../../models/Org');
const Personnel = require("../../models/Personnel");
const tokenAuth = require('../../middleware/token_auth');
const orgAuth = require('../../middleware/org_auth');

//@route  POST /api/orgs
//@desc   Adds a new organization
//@access site-admin only
router.post(
    "/",
    [
        tokenAuth,
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
            res.json({
                org: {
                    name: newOrg.name
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Server error'); 
        }
    }
);

router.get('/:orgId', [tokenAuth, orgAuth], async (req, res) => {
    const org = await Org.findById(req.params.orgId);
    const orgPersonnel = await Personnel.find({
        org: new mongoose.Types.ObjectId(org.id)
    });
    res.json({
        org: {
            name: org.name,
            personnel: orgPersonnel.map(personnel => {
                return {
                    name: personnel.name,
                    role: personnel.role,
                    title: personnel.title,
                    personnelURL: `/api/personnel/${personnel.id}`
                }
            })
        }
    });
});

module.exports = router;
