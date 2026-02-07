"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protect_middleware_1 = require("@/shared/middlewares/protect.middleware");
const transaction_factory_1 = require("./transaction.factory");
const express_1 = __importDefault(require("express"));
const requireRole_1 = require("@/shared/middlewares/requireRole");
const router = express_1.default.Router();
const transactionController = (0, transaction_factory_1.makeTransactionController)();
/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Payment Transactions
 */
/**
 * @swagger
 * /transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get all transactions
 *     description: Retrieves a list of all transactions (Admin or SuperAdmin only).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.get('/', protect_middleware_1.requireAuth, (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), transactionController.getAllTransactions);
/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction by ID
 *     description: Retrieves a specific transaction by its ID (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction details.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: Transaction not found.
 */
router.get('/:id', protect_middleware_1.requireAuth, (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), transactionController.getTransactionById);
/**
 * @swagger
 * /transactions/status/{id}:
 *   put:
 *     tags: [Transactions]
 *     summary: Update transaction status
 *     description: Updates the status of a specific transaction (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to update.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: SUCCESS
 *     responses:
 *       200:
 *         description: Transaction status updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: Transaction not found.
 */
router.put('/status/:id', protect_middleware_1.requireAuth, (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), transactionController.updateTransactionStatus);
/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     tags: [Transactions]
 *     summary: Delete transaction by ID
 *     description: Deletes a specific transaction by its ID (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction deleted successfully.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: Transaction not found.
 */
router.delete('/:id', protect_middleware_1.requireAuth, (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), transactionController.deleteTransaction);
exports.default = router;
