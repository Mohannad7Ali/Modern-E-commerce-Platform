"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const checkType_1 = require("@/shared/utils/checkType");
/**
 * HTTP layer for user routes.
 */
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        /** Admin: get all users */
        this.getAllUsers = (0, asyncHandler_1.default)(async (_req, res) => {
            const users = await this.userService.getAllUsers();
            (0, sendResponse_1.default)(res, 200, {
                data: { users },
                message: 'Users fetched successfully'
            });
        });
        /** Admin: get user by id */
        this.getUserById = (0, asyncHandler_1.default)(async (req, res) => {
            const id = (0, checkType_1.CheckParamsType)(req.params.id);
            const user = await this.userService.getUserById(id);
            (0, sendResponse_1.default)(res, 200, {
                data: { user },
                message: 'User fetched successfully'
            });
        });
        /** Logged-in user: get own profile */
        this.getMe = (0, asyncHandler_1.default)(async (req, res) => {
            const userId = req.user?.id;
            if (!userId)
                throw new AppError_1.default(401, 'User not authenticated');
            const user = await this.userService.getMe(userId);
            (0, sendResponse_1.default)(res, 200, {
                data: { user },
                message: 'Profile fetched successfully'
            });
        });
        this.getUserByEmail = (0, asyncHandler_1.default)(async (req, res) => {
            const email = (0, checkType_1.CheckParamsType)(req.params.email);
            const user = await this.userService.getUserByEmail(email);
            (0, sendResponse_1.default)(res, 200, {
                data: { user },
                message: 'User fetched successfully'
            });
        });
        /** Logged-in user: update own profile */
        this.updateMe = (0, asyncHandler_1.default)(async (req, res) => {
            const userId = req.user?.id;
            if (!userId)
                throw new AppError_1.default(401, 'User not authenticated');
            const { name, avatar } = req.body;
            const user = await this.userService.updateMe(userId, { name, avatar });
            (0, sendResponse_1.default)(res, 200, {
                data: { user },
                message: 'Profile updated successfully'
            });
            this.logsService.info('User profile updated', {
                userId,
                sessionId: req.session.id
            });
        });
        /** Admin: delete user */
        this.deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
            const targetUserId = (0, checkType_1.CheckParamsType)(req.params.id);
            const currentUserId = req.user?.id;
            if (!currentUserId)
                throw new AppError_1.default(401, 'User not authenticated');
            await this.userService.deleteUser(targetUserId, currentUserId);
            (0, sendResponse_1.default)(res, 204, { message: 'User deleted successfully' });
            this.logsService.info('User deleted', {
                userId: currentUserId,
                sessionId: req.session.id
            });
        });
        /** Admin: change user role */
        this.updateUserRole = (0, asyncHandler_1.default)(async (req, res) => {
            const targetUserId = (0, checkType_1.CheckParamsType)(req.params.id);
            const { role } = req.body;
            const user = await this.userService.updateUserRole(targetUserId, role);
            (0, sendResponse_1.default)(res, 200, {
                data: { user },
                message: 'User role updated successfully'
            });
        });
        this.createAdmin = (0, asyncHandler_1.default)(async (req, res) => {
            const { name, email, password } = req.body;
            const currentUserId = req.user?.id;
            if (!currentUserId) {
                throw new AppError_1.default(401, 'User not authenticated');
            }
            const newAdmin = await this.userService.createAdmin({ name, email, password }, currentUserId);
            (0, sendResponse_1.default)(res, 201, {
                data: { user: newAdmin },
                message: 'Admin created successfully'
            });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info('Admin created', {
                userId: req.user?.id,
                sessionId: req.session.id,
                timePeriod: end - start
            });
        });
    }
}
exports.UserController = UserController;
