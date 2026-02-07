"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        const user = req.user;
        if (!user) {
            return next(new AppError_1.default(401, 'Unauthorized'));
        }
        if (!allowedRoles.includes(user.role)) {
            return next(new AppError_1.default(403, 'Forbidden'));
        }
        next();
    };
}
