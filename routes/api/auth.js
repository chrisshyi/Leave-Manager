const express = require("express");
const token_auth = require("../../middleware/token_auth");
const router = express.Router();
const Personnel = require("../../models/Personnel");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route  POST api/auth
// @desc   Authenticates a user
// @access Public
router.post(
    "/",
    [
        check("email", "please enter a proper email").isEmail(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const { email, password } = req.body;
        try {
            let personnel = await Personnel.findOne({
                email
            });
            if (!personnel) {
                return res.status(400).json({
                    error: {
                        msg: "Invalid credentials"
                    }
                });
            }
            const isMatch = await bcrypt.compare(password, personnel.password);

            if (!isMatch) {
                return res.status(400).json({
                    error: {
                        msg: "Invalid credentials"
                    }
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

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 7200 },
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

// @route  GET api/auth
// @desc   Gets the authenticated user
// @access Public
router.get("/", token_auth, async (req, res) => {
    try {
        const personnel = await Personnel.findById(req.personnel.id).select(
            "-password"
        );
        return res.json(personnel);
    } catch (err) {
        console.log(err);
        res.status(500).send("server error");
    }
});

// @route POST api/auth/reset_pw
// @desc Allows the resetting of a user's password
// @access Public
router.post("/reset_pw", async (req, res) => {
    const { email } = req.body;
    try {
        let personnel = await Personnel.findOne({
            email
        });
        if (!personnel) {
            return res.json({}); // don't let user know whether or not the email exists
        }
        const payload = {
            personnel: {
                id: personnel.id,
                password: personnel.password // use old password
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
                const resetLink = getPasswordResetURL(token);
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: email,
                    from: 'password-reset@em1455.hr-manager.co',
                    subject: 'Reset Your Password',
                    text: 'Reset your password using the following link',
                    html: `Reset your password using the following <a href=${resetLink}>link</a>`,
                };
                sgMail
                    .send(msg)
                    .then(() => { 
                        console.log(`Reset email sent to ${email}`)
                    }, error => {
                        console.error(error);

                        if (error.response) {
                            console.error("SendGrid email error\n");
                            console.error(error.response.body);
                        }
                    });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send("server error");
    }
});

router.post("/pw_reset/set_new/token=:token", async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params; 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        const { id } = decoded.personnel;
        let personnel = await Personnel.findById(id); 
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
        personnel.password = newPasswordHash;
        await personnel.save();
        res.json({
            msg: "Reset successful!"
        });
    } catch (err) {
       if (err.name === 'TokenExpiredError') {
           return res.status(401).json({
               msg: 'Token expired!'
           });
       }
       res.status(401).json({
           msg: 'Token is invalid'
       });
    }
});

function getPasswordResetURL(token) {
    const urlSuffix = `/api/auth/pw_reset/set_new/token=${token}`;
    if (process.env.NODE_ENV === 'production') {
        return 'https://www.hr-manager.co' + urlSuffix;
    }
    return 'http://localhost:3000' + urlSuffix; 
}

module.exports = router;
