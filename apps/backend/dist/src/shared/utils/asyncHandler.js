"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => {
    return (req, res, next) => {
        // تنفيذ الدالة والتأكد من إرسال أي خطأ لـ Express Error Middleware
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
