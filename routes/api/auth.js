const express = require('express');
const auth = require('../../middleware/token_auth');
const router = express.Router();
const Personnel = require('../../models/Personnel');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route  POST api/auth
// @desc   Authenticates a user 
// @access Public
router.post('/',  [
    check('email', 'please enter a proper email').isEmail(),
    check('password', 'Password is required').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            })
        }
        const { email, password } = req.body;
        try {
            let personnel = await Personnel.findOne({
                email
            });
            if (!personnel) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid credentials'
                        }
                    ]
                });
            }
            const isMatch = await bcrypt.compare(password, personnel.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid credentials'
                        }
                    ]
                });
            }

            const payload = {
                personnel: {
                    id: personnel.id,
                    orgId: personnel.org, // include org id for org_auth middleware
                    role: personnel.role,
                    name: personnel.name
                }
            };

            jwt.sign(payload, 
                     config.get('jwtSecret'),
                     { expiresIn: 7200 },
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