"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class ChatRepository {
    async createChat(userId) {
        return prisma_1.prisma.chat.create({
            data: {
                userId,
                status: 'OPEN'
            },
            include: { user: true, messages: { include: { sender: true } } }
        });
    }
    async finduserChats(userId) {
        return prisma_1.prisma.chat.findMany({
            where: { userId },
            include: { user: true, messages: { include: { sender: true } } },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async findChatById(id) {
        return prisma_1.prisma.chat.findUnique({
            where: { id },
            include: { user: true, messages: { include: { sender: true } } }
        });
    }
    async findChatsByUser(userId) {
        return prisma_1.prisma.chat.findMany({
            where: { userId },
            include: { user: true, messages: { include: { sender: true } } },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async findAllChats(status) {
        return prisma_1.prisma.chat.findMany({
            where: status ? { status } : {},
            include: { messages: { include: { sender: true } } }
        });
    }
    async createMessage(chatId, senderId, content, type = 'TEXT', url) {
        return prisma_1.prisma.chatMessage.create({
            data: {
                chatId,
                senderId,
                content,
                type,
                url,
                createdAt: new Date()
            },
            include: { sender: true }
        });
    }
    async updateChatStatus(chatId, status) {
        return prisma_1.prisma.chat.update({
            where: { id: chatId },
            data: { status },
            include: { user: true, messages: { include: { sender: true } } }
        });
    }
}
exports.ChatRepository = ChatRepository;
