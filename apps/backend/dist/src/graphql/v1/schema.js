"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinedSchemas = void 0;
const productSchema_1 = require("@/modules/product/graphql/productSchema");
const schema_1 = require("@/modules/analytics/graphql/schema");
const schema_2 = require("@graphql-tools/schema");
exports.combinedSchemas = (0, schema_2.mergeSchemas)({
    schemas: [productSchema_1.productSchema, schema_1.analyticsSchema]
});
