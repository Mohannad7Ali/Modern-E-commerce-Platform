import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Documentation for Auth Module'
    },
    servers: [{ url: 'http://localhost:7000/api/v1' }]
  },
  // هنا نحدد مكان ملفات الـ Routes التي تحتوي على تعليقات Swagger
  apis: [
    path.join(__dirname, '../../modules/**/*.route.ts'),
    process.env.NODE_ENV === 'production' ? './dist/**/*.routes.js' : './src/**/*.routes.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
