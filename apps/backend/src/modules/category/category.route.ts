import { Router } from 'express';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { requireAuth } from '@/shared/middlewares/protect.middleware';
import { validateDto } from '@/shared/middlewares/validateDto';
import { requireRole } from '@/shared/middlewares/requireRole';
import { CreateCategoryDTO, UpdateCategoryDTO } from './category.dto';
const router = Router();
const repository = new CategoryRepository();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management and public catalog access
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Public endpoint to retrieve all product categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/categories/{slug}:
 *   get:
 *     summary: Get category by slug
 *     description: Public endpoint to retrieve a single category by its slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get('/:slug', controller.getBySlug);

/**
 * @swagger
 * /api/categories/admin:
 *   post:
 *     summary: Create a new category
 *     description: Admin-only endpoint to create a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/admin',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  validateDto(CreateCategoryDTO),
  controller.create
);

/**
 * @swagger
 * /api/categories/admin/{id}:
 *   patch:
 *     summary: Update a category
 *     description: Admin-only endpoint to update a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.patch(
  '/admin/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  validateDto(UpdateCategoryDTO),
  controller.update
);

/**
 * @swagger
 * /api/categories/admin/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Admin-only endpoint to delete a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.delete('/admin/:id', requireAuth, requireRole('ADMIN', 'SUPERADMIN'), controller.delete);

export default router;
