const { Leave } = require('../models/Leave');
const Personnel = require('../models/Personnel');

/**
 * Checks whether or not the user is authorized to add
 * a new leave
 */
module.exports.leaveAddAuth = async function(req, res, next) {
    // console.log(`Personnel role ${req.personnel.role}`);
    if (req.personnel.role === 'reg-user') {
        return res.status(401).json({
            msg: "You are not authorized"
        });
    } else if (req.personnel.role === 'HR-admin') {
        const personnel = await Personnel.findById(req.body.personnel);
        if (req.personnel.orgId !== personnel.org.toString()) {
            return res.status(401).json({
                msg: "You are not authorized"
            });
        }
    }
    next();
};

/**
 * Checks whether or not the user is authorized to modify
 * an existing leave
 */
module.exports.leaveModDeleteAuth = async function(req, res, next) {
    try {
        const leave = await Leave.findById(req.params.leaveId)
                                 .populate('personnel');

        if (!leave) {
            return res.status(400).json({
                msg: "Resource doesn't exist"
            });
        }

        if (req.personnel.role === 'HR-admin') {
            if (leave.personnel.org.toString() !== req.personnel.orgId) {
                return res.status(403).json({
                    msg: "You are not authorized"
                });
            }
        } else if (req.personnel.role === 'reg-user') {
                return res.status(403).json({
                    msg: "You are not authorized"
                });
        }
        req.leaveObj = leave;
        next();        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error"); 
    }
}

/**
 * Checks whether or not the user is authorized to 
 * retrieve information about a given leave
 */
module.exports.getLeaveInfoAuth = async function(req, res, next) {
    try {
        const leave = await Leave.findById(req.params.leaveId)
                                 .populate('personnel');
        if (!leave) {
            return res.status(400).json({
                msg: "Resource doesn't exist"
            });
        }
        if (req.personnel.role === 'HR-admin') {
            if (leave.personnel.org.toString() !== req.personnel.orgId) {
                return res.status(403).json({
                    msg: "You are not authorized"
                });
            }
        } else if (req.personnel.role === 'reg-user') {
            if (leave.personnel.id.toString() !== req.personnel.id) {
                return res.status(403).json({
                    msg: "You are not authorized"
                });
            }
        }
        next();        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error"); 
    }

}

