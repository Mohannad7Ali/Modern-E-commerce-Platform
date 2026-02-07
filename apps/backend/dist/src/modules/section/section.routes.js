"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const section_factory_1 = require("./section.factory");
const upload_middleware_1 = require("@/shared/middlewares/upload.middleware");
const requireRole_1 = require("@/shared/middlewares/requireRole");
const router = (0, express_1.Router)();
const sectionController = (0, section_factory_1.makeSectionController)();
/**
 * @swagger
 * tags:
 *   - name: Sections
 *     description: Endpoints for Sections
 */
/**
 * @swagger
 * /sections:
 *   get:
 *     tags: [Sections]
 *     summary: Get all sections
 *     description: Retrieves all sections of the application.
 *     responses:
 *       200:
 *         description: A list of all sections.
 */
router.get('/', (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), sectionController.getAllSections);
/**
 * @swagger
 * /sections/hero:
 *   get:
 *     tags: [Sections]
 *     summary: Get the hero section
 *     description: Retrieves the hero section of the application.
 *     responses:
 *       200:
 *         description: Hero section details.
 */
router.get('/hero', sectionController.findHero);
/**
 * @swagger
 * /sections/promo:
 *   get:
 *     summary: Get the promotional section
 *     description: Retrieves the promotional section of the application.
 *     responses:
 *       200:
 *         description: Promo section details.
 */
router.get('/promo', sectionController.findPromo);
/**
 * @swagger
 * /sections/benefits:
 *   get:
 *     tags: [Sections]
 *     summary: Get the benefits section
 *     description: Retrieves the benefits section of the application.
 *     responses:
 *       200:
 *         description: Benefits section details.
 */
router.get('/benefits', sectionController.findBenefits);
/**
 * @swagger
 * /sections/arrivals:
 *   get:
 *     tags: [Sections]
 *     summary: Get the arrivals section
 *     description: Retrieves the arrivals section of the application.
 *     responses:
 *       200:
 *         description: Arrivals section details.
 */
router.get('/arrivals', sectionController.findArrivals);
/**
 * @swagger
 * /sections:
 *   post:
 *     tags: [Sections]
 *     summary: Create a new section
 *     description: Creates a new section. Uploads up to 5 images for the section.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of images to be uploaded for the section.
 *     responses:
 *       201:
 *         description: Section created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post('/', upload_middleware_1.upload.array('images', 5), (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), sectionController.createSection);
/**
 * @swagger
 * /sections/{type}:
 *   put:
 *     tags: [Sections]
 *     summary: Update an existing section
 *     description: Updates a section based on the type provided.
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the section to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the section.
 *               content:
 *                 type: string
 *                 description: The content of the section.
 *     responses:
 *       200:
 *         description: Section updated successfully.
 *       400:
 *         description: Invalid input data.
 */
router.put('/:type', (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), sectionController.updateSection);
/**
 * @swagger
 * /sections/{type}:
 *   delete:
 *     tags: [Sections]
 *     summary: Delete a section
 *     description: Deletes a section based on the type provided.
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the section to be deleted.
 *     responses:
 *       200:
 *         description: Section deleted successfully.
 *       404:
 *         description: Section not found.
 */
router.delete('/:type', (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), sectionController.deleteSection);
exports.default = router;
