const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Personnel = require('../../models/Personnel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { adminAuth } = require('../../middleware/admin_auth');
const auth = require('../../middleware/token_auth');

// @route  POST api/personnel
// @desc   Register new personnel
// @access site-admin only
router.post('/',  [
    auth,
    adminAuth,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'please enter a proper email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({min: 6}),
    check('title', 'Title is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty(),
    check('role', 'Role must be either HR-admin or site-admin or reg-user').isIn(['HR-admin', 'site-admin', 'reg-user']),
    check('org', 'The personnel\'s organization must be specified').not().isEmpty()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const { name, email, password, title, role } = req.body;
        try {
            let personnel = await Personnel.findOne({
                email
            });
            if (personnel) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Personnel already exists'
                        }
                    ]
                });
            }

            personnel = new Personnel({
                email,
                name,
                password,
                role,
                title
            });
            const salt = await bcrypt.genSalt(10);
            personnel.password = await bcrypt.hash(password, salt);

            await personnel.save();
            const payload = {
                personnel: {
                    id: personnel.id,
                }
            }

            jwt.sign(payload, 
                     config.get('jwtSecret'),
                     { expiresIn: 3600 },
                     (err, token) => {
                         if (err) {
                             throw err;
                         } 
                         res.json({ token });
                     });
        } catch (err) {
            console.log(err);
            res.status(500).send('server error');
        }
    });

module.exports = router;