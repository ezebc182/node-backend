const jwt = require("jsonwebtoken");
const SEED = require("../config/config").SEED;

// =================================
// Verify token
// =================================

exports.verifyToken = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                notifications: "Invalid token",
                data: null
            });
        }

        req.user = decode.user;
        next();
    });
};