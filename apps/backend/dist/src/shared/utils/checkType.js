"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckParamsType = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const CheckParamsType = (data) => {
    if (typeof data !== 'string') {
        throw new AppError_1.default(400, 'Invalid parameter type');
    }
    return String(data);
};
exports.CheckParamsType = CheckParamsType;
