import express from 'express';
import { requireAuth } from '@/shared/middlewares/protect.middleware';
import { makeAddressController } from './address.factory';

const router = express.Router();
const addressController = makeAddressController();
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: User Address
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     tags: [Address]
 *     summary: Get all user addresses
 *     description: Retrieves a list of all addresses associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user addresses.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get('/', requireAuth, addressController.getUserAddresses);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     tags: [Address]
 *     summary: Get address details
 *     description: Retrieves detailed information about a specific address for the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the address to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The details of the specified address.
 *       404:
 *         description: Address not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get('/:id', requireAuth, addressController.getAddressDetails);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     tags: [Address]
 *     summary: Delete an address
 *     description: Deletes the specified address for the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the address to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address successfully deleted.
 *       404:
 *         description: Address not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.delete('/:id', requireAuth, addressController.deleteAddress);

export default router;
