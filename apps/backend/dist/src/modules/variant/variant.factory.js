"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeVariantController = void 0;
const variant_controller_1 = require("./variant.controller");
const variant_repository_1 = require("./variant.repository");
const product_repository_1 = require("../product/product.repository");
// import { AttributeRepository } from '../attribute/attribute.repository';
const variant_service_1 = require("./variant.service");
const makeVariantController = () => {
    const variantRepository = new variant_repository_1.VariantRepository();
    const productRepository = new product_repository_1.ProductRepository();
    const variantService = new variant_service_1.VariantService(variantRepository, productRepository);
    return new variant_controller_1.VariantController(variantService);
};
exports.makeVariantController = makeVariantController;
