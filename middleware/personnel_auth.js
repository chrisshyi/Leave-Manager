const Personnel = require('../models/Personnel');

module.exports = getPersonnelAuth = async function(req, res, next) {

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