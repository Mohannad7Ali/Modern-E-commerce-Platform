"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoute = void 0;
const express_1 = __importDefault(require("express"));
const v1_1 = require("./v1");
const configureRoute = (io) => {
    const router = express_1.default.Router();
    router.use('/v1', (0, v1_1.ConfigureV1Routes)(io));
    return router;
};
exports.configureRoute = configureRoute;
