"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureChatRoutes = configureChatRoutes;
const express_1 = __importDefault(require("express"));
const chat_factory_1 = require("./chat.factory");
const protect_middleware_1 = require("@/shared/middlewares/protect.middleware");
const upload_middleware_1 = require("@/shared/middlewares/upload.middleware");
function configureChatRoutes(io) {
    const chatController = (0, chat_factory_1.makeChatController)(io);
    const router = (0, express_1.default)();
    /**
     * @swagger
     * tags:
     *   name: Chat
     *   description: Chats and messages
     */
    /**
     * @swagger
     * /chats:
     *   get:
     *     tags: [Chat]
     *     summary: Get all chats
     *     description: Retrieves all chats for the authenticated user.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A list of all chats.
     */
    router.get('/', protect_middleware_1.requireAuth, chatController.getAllChats);
    /**
     * @swagger
     * /chats:
     *   post:
     *     tags: [Chat]
     *     summary: Create a new chat
     *     description: Creates a new chat for the authenticated user.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               participantIds:
     *                 type: array
     *                 items:
     *                   type: string
     *               topic:
     *                 type: string
     *     responses:
     *       201:
     *         description: Chat created successfully.
     */
    router.post('/', protect_middleware_1.requireAuth, chatController.createChat);
    /**
     * @swagger
     * /chats/user:
     *   get:
     *     tags: [Chat]
     *     summary: Get user's chats
     *     description: Retrieves all chats associated with the authenticated user.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A list of the user's chats.
     */
    router.get('/user', protect_middleware_1.requireAuth, chatController.getUserChats);
    /**
     * @swagger
     * /chats/{id}:
     *   get:
     *     tags: [Chat]
     *     summary: Get a specific chat by ID
     *     description: Retrieves details of a specific chat by its ID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat to retrieve.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Chat details.
     *       404:
     *         description: Chat not found.
     */
    router.get('/:id', protect_middleware_1.requireAuth, chatController.getChat);
    /**
     * @swagger
     * /chats/{chatId}/message:
     *   post:
     *     tags: [Chat]
     *     summary: Send a message in chat
     *     description: Sends a message in a specified chat, with optional file attachment.
     *     parameters:
     *       - in: path
     *         name: chatId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat to send the message to.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               message:
     *                 type: string
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Message sent successfully.
     */
    router.post('/:chatId/message', protect_middleware_1.requireAuth, upload_middleware_1.upload.single('file'), chatController.sendMessage);
    /**
     * @swagger
     * /chats/{chatId}/status:
     *   patch:
     *     tags: [Chat]
     *     summary: Update chat status
     *     description: Updates the status of a specific chat (e.g., read/unread).
     *     parameters:
     *       - in: path
     *         name: chatId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat to update.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Chat status updated successfully.
     *       404:
     *         description: Chat not found.
     */
    router.patch('/:chatId/status', protect_middleware_1.requireAuth, chatController.updateChatStatus);
    return router;
}
