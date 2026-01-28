import { requireAuth } from '@/shared/middlewares/protect.middleware';
import { makeTransactionController } from './transaction.factory';
import express from 'express';
import { requireRole } from '@/shared/middlewares/requireRole';

const router = express.Router();
const transactionController = makeTransactionController();

/**
 * @swagger
 * /transactions:
 *   get:
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
router.get('/', requireAuth, requireRole('ADMIN', 'SUPERADMIN'), transactionController.getAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
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
router.get('/:id', requireAuth, requireRole('ADMIN', 'SUPERADMIN'), transactionController.getTransactionById);

/**
 * @swagger
 * /transactions/status/{id}:
 *   put:
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
router.put(
  '/status/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  transactionController.updateTransactionStatus
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
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
router.delete('/:id', requireAuth, requireRole('ADMIN', 'SUPERADMIN'), transactionController.deleteTransaction);

export default router;
