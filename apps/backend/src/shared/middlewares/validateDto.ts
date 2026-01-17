import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import AppError from '../errors/AppError';
import logger from '@/infra/logging/logger';

export function validateDto(dtoClass: new () => object) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObj, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        property: err.property,
        constraints: err.constraints
      }));

      logger.error('Validation errors', formattedErrors);
      return next(new AppError(400, 'Validation failed', true, formattedErrors));
    }

    req.body = dtoObj;
    next();
  };
}
