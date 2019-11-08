const { Leave } = require('../models/Leave');

module.exports.leaveAddAuth = async function(req, res, next) {
    console.log(`Personnel role ${req.personnel.role}`);
    if (req.personnel.role !== 'site-admin' && req.personnel.role !== 'HR-admin') {
        return res.status(401).json({
            msg: "You are not authorized"
        });
    }
    next();
};

module.exports.leaveModAuth = async function(req, res, next) {
    try {
        const leave = await Leave.findById(req.params.leaveId)
                                 .populate('personnel');

        if (!leave) {
            return res.status(400).json({
                msg: "Resource doesn't exist"
            });
        }

        if (leave.personnel.org !== req.personnel.orgId || req.personnel.role === 'reg-user') {
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

module.exports.getLeaveInfoAuth = async function(req, res, next) {
    try {
        const leave = await Leave.findById(req.params.leaveId)
                                 .populate('personnel');

        console.log("Inside leave auth");
        console.log(`Request personnel org id ${req.personnel.orgId}`);
        console.log(`Leave personnel org id: ${leave.personnel.org}`);
        if (!leave) {
            return res.status(400).json({
                msg: "Resource doesn't exist"
            });
        }

        if (leave.personnel.org.toString() !== req.personnel.orgId) {
            return res.status(403).json({
                msg: "You are not authorized"
            });
        }
        if (leave.personnel.id !== req.personnel.id && req.personnel.id === 'reg-user') {
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

