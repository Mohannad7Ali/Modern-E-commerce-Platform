// declare module '@apollo/server/express4' {
//   import { Request, Response } from 'express';
//   import { ApolloServer, ApolloConfig } from '@apollo/server';
//   import { RequestHandler } from 'express';

//   export interface ExpressContextFunctionArgument {
//     req: Request;
//     res: Response;
//   }

//   export function expressMiddleware<TContext extends object>(
//     server: ApolloServer<TContext>,
//     options?: {
//       context?: (args: ExpressContextFunctionArgument) => Promise<TContext>;
//     }
//   ): RequestHandler;
// }
