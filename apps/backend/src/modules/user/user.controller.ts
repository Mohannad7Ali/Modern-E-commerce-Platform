import { Request, Response } from 'express';
import { UserService } from './user.service';
import asyncHandler from '@/shared/utils/asyncHandler';
import sendResponse from '@/shared/utils/sendResponse';
import { makeLogsService } from '../logs/logs.factory';
import AppError from '@/shared/errors/AppError';
import { CheckParamsType } from '@/shared/utils/checkType';

/**
 * HTTP layer for user routes.
 */
export class UserController {
  private readonly logsService = makeLogsService();

  constructor(private readonly userService: UserService) {}

  /** Admin: get all users */
  getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();

    sendResponse(res, 200, {
      data: { users },
      message: 'Users fetched successfully'
    });
  });

  /** Admin: get user by id */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = CheckParamsType(req.params.id);
    const user = await this.userService.getUserById(id);

    sendResponse(res, 200, {
      data: { user },
      message: 'User fetched successfully'
    });
  });

  /** Logged-in user: get own profile */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(401, 'User not authenticated');

    const user = await this.userService.getMe(userId);

    sendResponse(res, 200, {
      data: { user },
      message: 'Profile fetched successfully'
    });
  });
  getUserByEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const email = CheckParamsType(req.params.email);
    const user = await this.userService.getUserByEmail(email);
    sendResponse(res, 200, {
      data: { user },
      message: 'User fetched successfully'
    });
  });
  /** Logged-in user: update own profile */
  updateMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(401, 'User not authenticated');

    const { name, avatar } = req.body;

    const user = await this.userService.updateMe(userId, { name, avatar });

    sendResponse(res, 200, {
      data: { user },
      message: 'Profile updated successfully'
    });

    this.logsService.info('User profile updated', {
      userId,
      sessionId: req.session.id
    });
  });

  /** Admin: delete user */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const targetUserId = CheckParamsType(req.params.id);
    const currentUserId = req.user?.id;

    if (!currentUserId) throw new AppError(401, 'User not authenticated');

    await this.userService.deleteUser(targetUserId, currentUserId);

    sendResponse(res, 204, { message: 'User deleted successfully' });

    this.logsService.info('User deleted', {
      userId: currentUserId,
      sessionId: req.session.id
    });
  });

  /** Admin: change user role */
  updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const targetUserId = CheckParamsType(req.params.id);
    const { role } = req.body;

    const user = await this.userService.updateUserRole(targetUserId, role);

    sendResponse(res, 200, {
      data: { user },
      message: 'User role updated successfully'
    });
  });
  createAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      throw new AppError(401, 'User not authenticated');
    }

    const newAdmin = await this.userService.createAdmin({ name, email, password }, currentUserId);

    sendResponse(res, 201, {
      data: { user: newAdmin },
      message: 'Admin created successfully'
    });

    const start = Date.now();
    const end = Date.now();

    this.logsService.info('Admin created', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start
    });
  });
}
