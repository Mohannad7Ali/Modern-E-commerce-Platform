"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: `
Production-ready E-Commerce REST API.

Built with:
- Node.js + Express
- TypeScript
- Prisma + PostgreSQL
- Clean Architecture

This documentation describes all public endpoints,
authentication mechanisms, request/response formats,
and error handling conventions.
      `
        },
        servers: [
            {
                url: '/api/v1/',
                description: 'API Base URL'
            }
        ],
        // tags: [
        //   { name: 'Auth', description: 'Authentication & authorization' },
        //   { name: 'Attributes', description: 'Product attributes & values' },
        //   { name: 'Variants', description: 'Product variants & inventory' },
        //   { name: 'Categories', description: 'Product categories' },
        //   { name: 'Products', description: 'Product catalog' },
        //   { name: 'Address', description: 'User Address' }
        // ],
        components: {
            /* =========================
               🔐 SECURITY
            ========================= */
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'accessToken'
                }
            },
            /* =========================
               📦 COMMON SCHEMAS
            ========================= */
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Operation successful'
                        },
                        data: {
                            type: 'object',
                            nullable: true
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string',
                            example: 'Something went wrong'
                        }
                    }
                },
                ValidationErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'fail'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        example: 'email'
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Email is required'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    /**
     * Paths scanned for Swagger annotations
     */
    apis: ['src/modules/**/*.route.ts', 'src/modules/**/*.routes.ts', 'src/infra/swagger/**/*.ts']
});
