"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requireRole_1 = require("@/shared/middlewares/requireRole");
const protect_middleware_1 = require("@/shared/middlewares/protect.middleware");
const category_factory_1 = require("./category.factory");
const upload_middleware_1 = require("@/shared/middlewares/upload.middleware");
const validateDto_1 = require("@/shared/middlewares/validateDto");
const category_dto_1 = require("./category.dto");
const router = express_1.default.Router();
const categoryController = (0, category_factory_1.makeCategoryController)();
/**
 * @swagger
 * tags:
 *   name: Categroies
 *   description: Product's categories
 */
/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categroies]
 *     summary: Get all categories
 *     description: Retrieves a list of all categories available in the platform.
 *     responses:
 *       200:
 *         description: A list of categories.
 */
router.get('/', categoryController.getAllCategories);
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categroies]
 *     summary: Get category by ID
 *     description: Retrieves details of a specific category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to retrieve.
 *     responses:
 *       200:
 *         description: Category details.
 *       404:
 *         description: Category not found.
 */
router.get('/:id', categoryController.getCategory);
/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categroies]
 *     summary: Create a new category
 *     description: Creates a new category for the platform (Admin only).
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
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.post('/', protect_middleware_1.requireAuth, (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), upload_middleware_1.upload.array('images', 5), (0, validateDto_1.validateDto)(category_dto_1.CreateCategoryDTO), categoryController.createCategory);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categroies]
 *     summary: Delete category by ID
 *     description: Deletes a specific category by its ID (Admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       404:
 *         description: Category not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.delete('/:id', protect_middleware_1.requireAuth, (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), categoryController.deleteCategory);
exports.default = router;
