module.exports.adminAuth = function(req, res, next) {
    if (req.personnel.role !== 'site-admin') {
        return res.status(401).json({
            msg: "You are not authorized"
        });
    }
    next();
}