import { makeVariantController } from './variant.factory';
import { Router } from 'express';
import { requireAuth } from '../auth/middlewares/require-auth';
import { upload } from '@/shared/middlewares/upload.middleware';
const router = Router();
const controller = makeVariantController();
/**
 * @swagger
 * tags:
 *   name: Variants
 *   description: Product Variant catalog management
 */

/**
 * @swagger
 * /variants:
 *   get:
 *     summary: Get all variants
 *     tags: [Variants]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "TSHIRT"
 *     responses:
 *       200:
 *         description: Variants fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     variants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Variant'
 *                     totalResults:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     resultsPerPage:
 *                       type: integer
 */

router.get('/', controller.getAllVariants);
/**
 * @swagger
 * /variants/{id}:
 *   get:
 *     summary: Get variant by ID
 *     tags: [Variants]
 *     parameters:
 *       - $ref: '#/components/parameters/VariantIdParam'
 *     responses:
 *       200:
 *         description: Variant fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 *       404:
 *         description: Variant not found
 */

router.get('/:id', controller.getVariantById);
/**
 * @swagger
 * /variants/sku/{sku}:
 *   get:
 *     summary: Get variant by SKU
 *     tags: [Variants]
 *     parameters:
 *       - $ref: '#/components/parameters/VariantSkuParam'
 *     responses:
 *       200:
 *         description: Variant fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 */

router.get('/sku/:sku', controller.getVariantBySku);
// router.get('/:id/restock-history', controller.getRestockHistory);

/**
 * @swagger
 * /variants:
 *   post:
 *     summary: Create a new variant
 *     tags: [Variants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - sku
 *               - price
 *               - stock
 *               - attributes
 *             properties:
 *               productId:
 *                 type: string
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               lowStockThreshold:
 *                 type: integer
 *               barcode:
 *                 type: string
 *               warehouseLocation:
 *                 type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/VariantAttribute'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *       400:
 *         description: Invalid input
 */
// 'images' must match the key name you use in Postman
router.post('/', upload.array('images', 5), controller.createVariant);

/**
 * @swagger
 * /variants/{id}:
 *   patch:
 *     summary: Update a variant
 *     tags: [Variants]
 *     parameters:
 *       - $ref: '#/components/parameters/VariantIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               lowStockThreshold:
 *                 type: integer
 *               barcode:
 *                 type: string
 *               warehouseLocation:
 *                 type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/VariantAttribute'
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *       404:
 *         description: Variant not found
 */

router.patch('/:id', upload.array('images', 5), controller.updateVariant);
// router.post('/:id/restock', requireAuth, controller.restockVariant);

/**
 * @swagger
 * /variants/{id}:
 *   delete:
 *     summary: Delete a variant
 *     tags: [Variants]
 *     parameters:
 *       - $ref: '#/components/parameters/VariantIdParam'
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 */

router.delete('/:id', controller.deleteVariant);

export default router;
