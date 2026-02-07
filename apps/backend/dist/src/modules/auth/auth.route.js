"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const user_repository_1 = require("./repositories/user.repository");
const require_auth_1 = require("./middlewares/require-auth");
const validateDto_1 = require("@/shared/middlewares/validateDto");
const auth_dto_1 = require("./auth.dto");
const handleSocialLogin_1 = __importDefault(require("@/shared/utils/handleSocialLogin"));
const passport_1 = __importDefault(require("passport"));
const constants_1 = require("@/shared/constants");
const cart_service_1 = require("../cart/cart.service");
const cart_repository_1 = require("../cart/cart.repository");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController(new auth_service_1.AuthService(new user_repository_1.UserRepository()));
const cartService = new cart_service_1.CartService(new cart_repository_1.CartRepository());
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
router.get('/google', (0, handleSocialLogin_1.default)('google'));
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
router.get('/google/callback', passport_1.default.authenticate('google', {
    session: false,
    failureRedirect: env === 'production' ? CLIENT_URL_PROD : CLIENT_URL_DEV
}), async (req, res) => {
    const user = req.user;
    const { accessToken, refreshToken } = user;
    res.cookie('refreshToken', refreshToken, constants_1.cookieOptions);
    res.cookie('accessToken', accessToken, constants_1.cookieOptions);
    const userId = user.id;
    const sessionId = req.session.id;
    await cartService?.mergeCartsOnLogin(sessionId, userId);
    res.redirect(env === 'production' ? CLIENT_URL_PROD : CLIENT_URL_DEV);
});
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
router.post('/sign-up', (0, validateDto_1.validateDto)(auth_dto_1.RegisterDto), authController.signup);
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
router.post('/sign-in', (0, validateDto_1.validateDto)(auth_dto_1.SigninDto), authController.signin);
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
router.post('/refresh', require_auth_1.requireAuth, authController.refresh);
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
router.post('/sign-out', require_auth_1.requireAuth, authController.signout);
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
router.get('/me', require_auth_1.requireAuth, authController.me);
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
router.post('/forgot-password', (0, validateDto_1.validateDto)(auth_dto_1.ForgotPasswordDto), authController.forgotPassword);
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
router.post('/reset-password', (0, validateDto_1.validateDto)(auth_dto_1.ResetPasswordDto), authController.resetPassword);
exports.default = router;
