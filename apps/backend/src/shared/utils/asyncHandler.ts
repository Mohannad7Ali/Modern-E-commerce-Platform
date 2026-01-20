import { Request, Response, NextFunction } from 'express';

/**
 * @description كود التغليف (Wrapper) لمعالجة الدوال غير المتزامنة في Express.
 * * @problem في النسخ الحالية من Express، الأخطاء التي تحدث داخل الـ `async` Functions
 * لا يتم تمريرها تلقائياً إلى Middleware معالجة الأخطاء، مما قد يتسبب في تعليق الطلب (Request Hanging).
 * * @solution يقوم هذا الـ Handler باستقبال دالة الـ Controller وتغليفها بـ Promise.
 * في حال حدوث أي خطأ (Reject)، يتم استدعاء `next(err)` فوراً وبشكل آلي.
 * * @benefits
 * 1. يغنيك عن كتابة `try...catch` في كل Controller.
 * 2. يضمن عدم تعليق أي طلب في حال حدوث خطأ غير متوقع.
 * 3. يحافظ على الكود نظيفاً (Clean Code) ويركز فقط على Business Logic.
 * * @example
 * router.get("/products", asyncHandler(async (req, res) => {
 * const products = await prisma.product.findMany();
 * res.json(products);
 * }));
 */

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // تنفيذ الدالة والتأكد من إرسال أي خطأ لـ Express Error Middleware
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
