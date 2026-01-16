import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requireAuth } from './middlewares/require-auth';
import { validateDto } from '@/shared/middlewares/validateDto';
import { ForgotPasswordDto, RegisterDto, ResetPasswordDto, SigninDto } from './auth.dto';
const router = Router();
/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: User sign-up
 *     description: Allows a new user to register by providing necessary details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *               fullName:
 *                 type: string
 *                 description: User's full name.
 *     responses:
 *       201:
 *         description: User successfully created.
 */

router.post('/sign-up', validateDto(RegisterDto), AuthController.signup);
/**
 * @swagger
 * /sign-in:
 *   post:
 *     summary: User sign-in
 *     description: Allows an existing user to sign in using their credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: User successfully signed in.
 */
router.post('/sign-in', validateDto(SigninDto), AuthController.signin);
/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh authentication token
 *     description: Allows a user to refresh their authentication token when it expires.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token to obtain a new access token.
 *     responses:
 *       200:
 *         description: Successfully refreshed the token.
 */
router.post('/refresh', AuthController.refresh);
/**
 * @swagger
 * /sign-out:
 *   post:
 *     summary: User sign-out
 *     description: Logs the user out of the application by invalidating their session.
 *     responses:
 *       200:
 *         description: User successfully signed out.
 */
router.post('/sign-out', requireAuth, AuthController.signout);
router.get('/me', requireAuth, AuthController.me);
/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a 10-minute expiration token to the user's email if it exists in the database.
 *     tags: [Auth]
 *     requestBody:
 *     required: true
 *     content:
 *     application/json:
 *     schema:
 *     type: object
 *     required:
 *     - email
 *     properties:
 *     email:
 *     type: string
 *     example: user@example.com
 *     responses:
 *     200:
 *     description: Reset email sent successfully.
 *     404:
 *     description: User not found.
 */
router.post('/forgot-password', validateDto(ForgotPasswordDto), AuthController.forgotPassword);
/**
 * @swagger
 * /reset-password:
 * post:
 * summary: Reset password using token
 * description: Verifies the token from the verification table and updates the user's password.
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - token
 * - newPassword
 * properties:
 * token:
 * type: string
 * description: The random token received via email.
 * newPassword:
 * type: string
 * minLength: 6
 * example: "Secret123!"
 * responses:
 * 200:
 * description: Password updated and verification token cleared.
 * 400:
 * description: Invalid or expired token.
 */
router.post('/reset-password', validateDto(ResetPasswordDto), AuthController.resetPassword);

export default router;
