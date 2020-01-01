const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require("express-validator");
const Org = require('../../models/Org');
const Personnel = require("../../models/Personnel");
const tokenAuth = require('../../middleware/token_auth');
const orgAuth = require('../../middleware/org_auth');
const bcrypt = require('bcryptjs');

//@route  POST /api/orgs
//@desc   Adds a new organization
//@access Public 
router.post(
    "/",
    [
        check("orgName", "Organization must have a name")
            .not()
            .isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const { orgName, personnelName, email, password, title } = req.body;
        /*
        let orgLookUp = await Org.find({
            name: req.body.orgName
        });
        
        if (!orgLookUp) {
            return res.status(400).json({
                msg: "Organization name already exists!"
            });
        }
        */
        try {
            let newOrg = new Org({
                name: orgName
            });

            await newOrg.save();
            if (typeof personnelName !== 'undefined') {
                // create new administrator along with new organization
                let personnelLookup = await Personnel.find({
                    email
                });
                if (!personnelLookup) {
                    return res.status(400).json({
                        error: {
                            msg: "Email already exists!"
                        }
                    });
                }
                let newAdmin = new Personnel({
                    name: personnelName,
                    email: email,
                    org: newOrg.id,
                    role: "HR-admin",
                    title
                });

                const salt = await bcrypt.genSalt(10);
                newAdmin.password = await bcrypt.hash(password, salt);
                await newAdmin.save();
            }

            res.json({
                org: {
                    name: newOrg.name,
                    orgId: newOrg.id
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Server error'); 
        }
    }
);

//@route GET /api/orgs/{orgId}
//@desc Retrieves organzation information
//@access HR-admins may only access their own organization's information. Site-admins 
//        have access to all organization information. Forbidden to regular users
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
