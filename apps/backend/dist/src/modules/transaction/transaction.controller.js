"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const logs_factory_1 = require("../logs/logs.factory");
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const checkType_1 = require("@/shared/utils/checkType");
class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getAllTransactions = (0, asyncHandler_1.default)(async (req, res) => {
            const transactions = await this.transactionService.getAllTransactions();
            (0, sendResponse_1.default)(res, 200, {
                data: { transactions },
                message: 'Fetched transactions successfully'
            });
        });
        this.getTransactionById = (0, asyncHandler_1.default)(async (req, res) => {
            const id = (0, checkType_1.CheckParamsType)(req.params.id);
            const transaction = await this.transactionService.getTransactionById(id);
            if (!transaction) {
                throw new AppError_1.default(404, 'Transaction not found');
            }
            (0, sendResponse_1.default)(res, 200, {
                data: { transaction },
                message: 'Fetched transaction successfully'
            });
        });
        this.updateTransactionStatus = (0, asyncHandler_1.default)(async (req, res) => {
            const id = (0, checkType_1.CheckParamsType)(req.params.id);
            const { status } = req.body;
            console.log('status => ', status);
            const updatedTransaction = await this.transactionService.updateTransactionStatus(id, { status });
            (0, sendResponse_1.default)(res, 200, {
                data: { updatedTransaction },
                message: 'Updated transaction successfully'
            });
        });
        this.deleteTransaction = (0, asyncHandler_1.default)(async (req, res) => {
            const id = (0, checkType_1.CheckParamsType)(req.params.id);
            await this.transactionService.deleteTransaction(id);
            (0, sendResponse_1.default)(res, 204, { message: 'Deleted transaction successfully' });
        });
    }
}
exports.TransactionController = TransactionController;
