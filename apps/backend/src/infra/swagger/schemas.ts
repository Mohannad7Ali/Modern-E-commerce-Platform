/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         images:
 *           type: array
 *           items:
 *             type: string
 *
 *     CreateCategoryInput:
 *       type: object
 *       required: [name, slug]
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 */
