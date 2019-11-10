const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Authenticates a user and adds an access token to the request
 */
module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            msg: "No token, authorization denied"
        });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.personnel = decoded.personnel; // add personnel information to request object
        //console.log('Decoded personnel');
        //console.log(decoded.personnel);
        next();
   } catch (err) {
       res.status(401).json({
           msg: 'Token is not valid'
       });
   }
};