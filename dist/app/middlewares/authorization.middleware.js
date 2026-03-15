"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role: ${user?.role || 'unknown'} is not allowed to access this resource`,
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
