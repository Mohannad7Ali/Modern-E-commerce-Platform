/**
 * @swagger
 * components:
 *   schemas:
 *     VariantAttribute:
 *       type: object
 *       required:
 *         - attributeId
 *         - valueId
 *       properties:
 *         attributeId:
 *           type: string
 *           example: "color"
 *         valueId:
 *           type: string
 *           example: "red"
 *
 *     Variant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clw9x2p3c0001"
 *         productId:
 *           type: string
 *           example: "clw9x1abc0000"
 *         sku:
 *           type: string
 *           example: "TSHIRT-BLACK-M"
 *         price:
 *           type: number
 *           example: 49.99
 *         stock:
 *           type: integer
 *           example: 120
 *         lowStockThreshold:
 *           type: integer
 *           example: 10
 *         barcode:
 *           type: string
 *           example: "1234567890123"
 *         warehouseLocation:
 *           type: string
 *           example: "A-3-SHELF-2"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: "https://cdn.example.com/variant.jpg"
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantAttribute'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
