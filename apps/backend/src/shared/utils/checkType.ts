import AppError from '../errors/AppError';

export const CheckParamsType = (data: any): string => {
  if (typeof data !== 'string') {
    throw new AppError(400, 'Invalid parameter type');
  }
  return data;
};
