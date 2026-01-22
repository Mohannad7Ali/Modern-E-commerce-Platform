import { Request } from 'express';
import { Session } from 'express-session';

declare global {
  namespace Express {
    interface Request {
      // تعريف المستخدم الذي أضفته أنت
      user?: {
        id: string;
        role: string;
      };
      // إضافة تعريف الجلسة لكي يتعرف عليها TypeScript
      session: Session & {
        userId?: string;
        role?: string;
      };
    }
  }
}
