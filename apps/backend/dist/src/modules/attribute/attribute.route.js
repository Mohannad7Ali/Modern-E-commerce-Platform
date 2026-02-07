"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attribute_factory_1 = require("./attribute.factory");
const router = express_1.default.Router();
const controller = (0, attribute_factory_1.makeAttributeController)();
/**
 * @swagger
 * tags:
 *   name: Attributes
 *   description: Product attributes & values management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Attribute:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "attr_123"
 *         name:
 *           type: string
 *           example: "Color"
 *         values:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributeValue'
 *
 *     AttributeValue:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "val_456"
 *         value:
 *           type: string
 *           example: "Red"
 *
 *     AssignAttributeToCategory:
 *       type: object
 *       required:
 *         - categoryId
 *         - attributeId
 *       properties:
 *         categoryId:
 *           type: string
 *           example: "cat_789"
 *         attributeId:
 *           type: string
 *           example: "attr_123"
 *         isRequired:
 *           type: boolean
 *           example: true
 */
/**
 * @swagger
 * /attributes:
 *   get:
 *     summary: Get all attributes
 *     tags: [Attributes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by attribute name
 *     responses:
 *       200:
 *         description: Attributes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     attributes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Attribute'
 */
router.get('/', controller.getAllAttributes);
/**
 * @swagger
 * /attributes/{id}:
 *   get:
 *     summary: Get attribute by ID
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attribute ID
 *     responses:
 *       200:
 *         description: Attribute fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     attribute:
 *                       $ref: '#/components/schemas/Attribute'
 *       404:
 *         description: Attribute not found
 */
router.get('/:id', controller.getAttribute);
/**
 * @swagger
 * /attributes:
 *   post:
 *     summary: Create a new attribute
 *     tags: [Attributes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Size"
 *     responses:
 *       201:
 *         description: Attribute created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', controller.createAttribute);
/**
 * @swagger
 * /attributes/value:
 *   post:
 *     summary: Create attribute value
 *     tags: [Attributes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attributeId
 *               - value
 *             properties:
 *               attributeId:
 *                 type: string
 *                 example: "attr_123"
 *               value:
 *                 type: string
 *                 example: "XL"
 *     responses:
 *       201:
 *         description: Attribute value created successfully
 */
router.post('/value', controller.createAttributeValue);
/**
 * @swagger
 * /attributes/assign-category:
 *   post:
 *     summary: Assign attribute to category
 *     tags: [Attributes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignAttributeToCategory'
 *     responses:
 *       201:
 *         description: Attribute assigned to category successfully
 */
router.post('/assign-category', controller.assignAttributeToCategory);
/**
 * @swagger
 * /attributes/{id}:
 *   delete:
 *     summary: Delete attribute
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attribute ID
 *     responses:
 *       200:
 *         description: Attribute deleted successfully
 *       404:
 *         description: Attribute not found
 */
router.delete('/:id', controller.deleteAttribute);
/**
 * @swagger
 * /attributes/value/{id}:
 *   delete:
 *     summary: Delete attribute value
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attribute value ID
 *     responses:
 *       200:
 *         description: Attribute value deleted successfully
 *       404:
 *         description: Attribute value not found
 */
router.delete('/value/:id', controller.deleteAttributeValue);
exports.default = router;
