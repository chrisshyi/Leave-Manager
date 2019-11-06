module.exports.hrAdminAuth = function(req, res, next) {
    // We want site-admins to have at least the same privileges as hr-admin, with 
    // additional privileges
    if (req.personnel.role !== 'site-admin' && req.personnel.role !== 'hr-admin') {
        return res.status(401).json({
            msg: "You are not authorized"
        });
    }
    next();
}