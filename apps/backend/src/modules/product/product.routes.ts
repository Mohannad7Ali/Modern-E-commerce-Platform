import express from 'express';

import { requireAuth } from '@/shared/middlewares/protect.middleware';
import { requireRole } from '@/shared/middlewares/requireRole';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { validateDto } from '@/shared/middlewares/validateDto';

const router = express.Router();
const repo = new ProductRepository();
const service = new ProductService(repo);
const productController = new ProductController(service);
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog management
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieves a list of all products.
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get('/', productController.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieves a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Product details.
 *       404:
 *         description: Product not found.
 */
router.get('/:id', productController.getById);

/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     description: Retrieves a specific product by its slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the product to retrieve.
 *     responses:
 *       200:
 *         description: Product details.
 *       404:
 *         description: Product not found.
 */
router.get('/:slug', productController.getBySlug);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     description: Updates a specific product by its ID (Admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User d  validateDto(UpdateProductDto),
 */
router.put(
  '/admin/:id',
  validateDto(UpdateProductDto),
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  // upload.array('images', 10),
  productController.update
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create new product
 *     description: Creates a new product (Admin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.post(
  '/',
  validateDto(CreateProductDto),
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  productController.create
);

/**
 * @swagger
 * /products/bulk:
 *   post:
 *     summary: Bulk create products
 *     description: Bulk creates multiple products via file upload (Admin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Products created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
// router.post(
//   '/bulk',
//   protect,
//   authorizeRole('ADMIN', 'SUPERADMIN'),
//   upload.single('file'),
//   productController.bulkCreateProducts
// );

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Deletes a specific product by its ID (Admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.delete('/:id', requireAuth, requireRole('ADMIN', 'SUPERADMIN'), productController.delete);

export default router;
