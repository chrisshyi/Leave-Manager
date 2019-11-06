const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    if (req.params.orgId !== req.personnel.orgId) {
        return res.status(403).json({
            msg: "You are not authorized"
        });
    }
    next();
}

