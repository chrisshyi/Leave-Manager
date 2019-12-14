const Personnel = require('../models/Personnel');

/**
 * Checks whether or not the user has authorization to
 * access personnel information
 */
module.exports.getPersonnelAuth = async function(req, res, next) {

    const personnel = await Personnel.findById(req.params.personnelId);

    if (!personnel) {
        return res.status(400).json({
            msg: "Resource doesn't exist"
        });
    }

    if (req.personnel.role === 'HR-admin') {
        if (req.personnel.orgId !== personnel.org.toString()) {
            return res.status(403).json({
                msg: "You are not authorized"
            });
        }
    } else if (req.personnel.role === 'reg-user') {
        if (req.personnel.id !== personnel.id) {
            return res.status(403).json({
                msg: "You are not authorized"
            });
        }
    }
    res.data = {};
    res.data['personnel'] = personnel;
    next();
};

module.exports.addOrEditPersonnelAuth = function(req, res, next) {
    const role = req.personnel.role;
    if (role === 'HR-admin') {
        if (req.body.role === 'site-admin') {
            return res.status(403).json({
                msg: "You are not authorized"
            })
        } else if (req.body.role === 'HR-admin' && req.body.org !== req.personnel.orgId) {
            return res.status(403).json({
                msg: "You are not authorized"
            })
        }
    } else if (role === 'reg-user') {
        return res.status(403).json({
            msg: "You are not authorized"
        });
    }
    next();
};