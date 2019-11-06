module.exports.adminAuth = function(req, res, next) {
    console.log(req.personnel);
    if (req.personnel.role !== 'site-admin') {
        return res.status(401).json({
            msg: "You are not authorized"
        });
    }
    next();
}