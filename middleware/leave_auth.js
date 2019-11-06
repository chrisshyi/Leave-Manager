const Leave = require('../models/Leave');

module.exports.leaveAddAuth = async function(req, res, next) {
    console.log(req.personnel);
    if (req.personnel.role !== 'site-admin') {
        return res.status(401).json({
            msg: "You are not authorized"
        });
    }
    next();
}

module.exports.leaveModAuth = async function(req, res, next) {
    try {
        const leave = await Leave.findById(req.params.leaveId)
                                 .populate('personnel');

        if (!leave) {
            return res.status(400).json({
                msg: "Resource doesn't exist"
            });
        }

        if (leave.personnel.org !== req.personnel.orgId) {
            return res.status(403).json({
                msg: "You are not authorized"
            });
        }
        next();        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error"); 
    }
}

