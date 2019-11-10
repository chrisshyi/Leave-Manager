const Org = require('../models/Org');
const Personnel = require('../models/Personnel');

/**
 * Checks whether or not a user is authorzied to access 
 * organization information
 */
module.exports = async function(req, res, next) {
    if (req.personnel.role === 'HR-admin') {
        if (req.personnel.orgId !== req.params.orgId) {
            return res.status(401).json({
                msg: "You are not authorized"
            })
        }
    } else if (req.personnel.role === 'reg-user') {
            return res.status(401).json({
                msg: "You are not authorized"
            })
    }
    next();
}