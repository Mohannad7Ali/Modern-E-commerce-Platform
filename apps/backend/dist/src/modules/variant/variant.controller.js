"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const checkType_1 = require("@/shared/utils/checkType");
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const uploadToCloudinary_1 = require("@/shared/utils/uploadToCloudinary");
class VariantController {
    constructor(variantService) {
        this.variantService = variantService;
        this.getAllVariants = (0, asyncHandler_1.default)(async (req, res) => {
            const { variants, totalResults, totalPages, currentPage, resultsPerPage } = await this.variantService.getAllVariants(req.query);
            (0, sendResponse_1.default)(res, 200, {
                data: {
                    variants,
                    totalResults,
                    totalPages,
                    currentPage,
                    resultsPerPage
                },
                message: 'Variants fetched successfully'
            });
        });
        this.getVariantById = (0, asyncHandler_1.default)(async (req, res) => {
            const variantId = (0, checkType_1.CheckParamsType)(req.params.id);
            const variant = await this.variantService.getVariantById(variantId);
            (0, sendResponse_1.default)(res, 200, {
                data: { variant },
                message: 'Variant fetched successfully'
            });
        });
        this.getVariantBySku = (0, asyncHandler_1.default)(async (req, res) => {
            const sku = (0, checkType_1.CheckParamsType)(req.params.sku);
            const variant = await this.variantService.getVariantBySku(sku);
            (0, sendResponse_1.default)(res, 200, {
                data: { variant },
                message: 'Variant fetched successfully'
            });
        });
        this.createVariant = (0, asyncHandler_1.default)(async (req, res) => {
            const { productId, sku, price, stock, lowStockThreshold, barcode, warehouseLocation, attributes } = req.body;
            let parsedAttributes;
            try {
                parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
                if (!Array.isArray(parsedAttributes)) {
                    throw new AppError_1.default(400, 'Attributes must be an array');
                }
                parsedAttributes.forEach((attr, index) => {
                    if (!attr.attributeId || !attr.valueId) {
                        throw new AppError_1.default(400, `Invalid attribute structure at index ${index}`);
                    }
                });
                const attributeIds = parsedAttributes.map((attr) => attr.attributeId);
                if (new Set(attributeIds).size !== attributeIds.length) {
                    throw new AppError_1.default(400, 'Duplicate attributes in variant');
                }
            }
            catch (error) {
                throw new AppError_1.default(400, 'Invalid attributes format');
            }
            console.log('req.files: ', req.files);
            const files = req.files;
            let imageUrls = [];
            if (Array.isArray(files) && files.length > 0) {
                const uploadedImages = await (0, uploadToCloudinary_1.uploadToCloudinary)(files);
                imageUrls = uploadedImages.map(img => img.url).filter(Boolean);
            }
            const variant = await this.variantService.createVariant({
                productId,
                sku,
                price: Number(price),
                stock: Number(stock),
                lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : undefined,
                barcode,
                warehouseLocation,
                images: imageUrls,
                attributes: parsedAttributes
            });
            (0, sendResponse_1.default)(res, 201, { data: { variant }, message: 'Variant created successfully' });
        });
        this.updateVariant = (0, asyncHandler_1.default)(async (req, res) => {
            const variantId = (0, checkType_1.CheckParamsType)(req.params.id);
            const { sku, price, stock, lowStockThreshold, barcode, warehouseLocation, attributes } = req.body;
            let parsedAttributes;
            if (attributes) {
                try {
                    parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
                    if (!Array.isArray(parsedAttributes)) {
                        throw new AppError_1.default(400, 'Attributes must be an array');
                    }
                    parsedAttributes.forEach((attr, index) => {
                        if (!attr.attributeId || !attr.valueId) {
                            throw new AppError_1.default(400, `Invalid attribute structure at index ${index}`);
                        }
                    });
                    const attributeIds = parsedAttributes.map((attr) => attr.attributeId);
                    if (new Set(attributeIds).size !== attributeIds.length) {
                        throw new AppError_1.default(400, 'Duplicate attributes in variant');
                    }
                }
                catch (error) {
                    throw new AppError_1.default(400, 'Invalid attributes format');
                }
            }
            //TODO upload File
            const imageUrls = [''];
            const updateData = {
                ...(sku !== undefined && { sku }),
                ...(price !== undefined && { price: Number(price) }),
                ...(stock !== undefined && { stock: Number(stock) }),
                ...(lowStockThreshold !== undefined && { lowStockThreshold: Number(lowStockThreshold) }),
                ...(barcode !== undefined && { barcode }),
                ...(warehouseLocation !== undefined && { warehouseLocation }),
                ...(imageUrls.length > 0 && { images: imageUrls }),
                ...(parsedAttributes && { attributes: parsedAttributes })
            };
            const variant = await this.variantService.updateVariant(variantId, updateData);
            (0, sendResponse_1.default)(res, 200, {
                data: { variant },
                message: 'Variant updated successfully'
            });
        });
        this.deleteVariant = (0, asyncHandler_1.default)(async (req, res) => {
            const variantId = (0, checkType_1.CheckParamsType)(req.params.id);
            await this.variantService.deleteVariant(variantId);
            (0, sendResponse_1.default)(res, 200, { message: 'Variant deleted successfully' });
        });
    }
}
exports.VariantController = VariantController;
