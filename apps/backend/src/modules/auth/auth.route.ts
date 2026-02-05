import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { requireAuth } from './middlewares/require-auth';
import { validateDto } from '@/shared/middlewares/validateDto';
import { ForgotPasswordDto, RegisterDto, ResetPasswordDto, SigninDto } from './auth.dto';
import handleSocialLogin from '@/shared/utils/handleSocialLogin';
import passport from 'passport';
import { cookieOptions } from '@/shared/constants';
import { CartService } from '../cart/cart.service';
import { CartRepository } from '../cart/cart.repository';
const router = Router();
const authController = new AuthController(new AuthService(new UserRepository()));
const cartService = new CartService(new CartRepository());
const CLIENT_URL_DEV = process.env.CLIENT_URL_DEV;
const CLIENT_URL_PROD = process.env.CLIENT_URL_PROD;
const env = process.env.NODE_ENV;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & authorization endpoints
 */

/**
 * @swagger
 * /google:
 *   get:
 *     tags: [Auth]
 *     summary: Redirect to Google for authentication
 *     description: Initiates the OAuth flow for Google login.
 *     responses:
 *       302:
 *         description: Redirect to Google login page.
 */
router.get('/google', handleSocialLogin('google'));
/**
 * @swagger
 * /google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Handle callback from Google OAuth
 *     description: Handles the response from Google after OAuth authentication is complete.
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: env === 'production' ? CLIENT_URL_PROD : CLIENT_URL_DEV
  }),
  async (req: any, res: any) => {
    const user = req.user;
    const { accessToken, refreshToken } = user;

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);

    const userId = user.id;
    const sessionId = req.session.id;
    await cartService?.mergeCartsOnLogin(sessionId, userId);

    res.redirect(env === 'production' ? CLIENT_URL_PROD : CLIENT_URL_DEV);
  }
);

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: User sign-up
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Secret123!
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Validation error
 */
router.post('/sign-up', validateDto(RegisterDto), authController.signup);

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: User sign-in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Secret123!
 *     responses:
 *       200:
 *         description: User successfully signed in
 *       401:
 *         description: Invalid credentials
 */
router.post('/sign-in', validateDto(SigninDto), authController.signin);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', requireAuth, authController.refresh);

/**
 * @swagger
 * /auth/sign-out:
 *   post:
 *     summary: User sign-out
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully signed out
 *       401:
 *         description: Unauthorized
 */
router.post('/sign-out', requireAuth, authController.signout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requireAuth, authController.me);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset email sent successfully
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', validateDto(ForgotPasswordDto), authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token received via email
 *                 example: 9f1c2b7a9e
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: Secret123!
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', validateDto(ResetPasswordDto), authController.resetPassword);

export default router;
