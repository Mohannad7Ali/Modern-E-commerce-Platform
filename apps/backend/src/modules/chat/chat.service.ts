import { Chat, ChatMessage } from '@/generated/prisma-client/client';
import { ChatRepository } from './chat.repository';
import { Server as SocketIOServer } from 'socket.io';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private io: SocketIOServer
  ) {}
  async createChat(userId: string): Promise<Chat> {
    const chat = await this.chatRepository.createChat(userId);
    this.io.to('admin').emit('chatCreated', chat);
    return chat;
  }
  async getChat(id: string): Promise<Chat | null> {
    const chat = await this.chatRepository.findChatById(id);
    if (!chat) throw new Error('Chat not found');
    return chat;
  }
  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatRepository.findChatsByUser(userId);
  }

  async getAllChats(status?: 'OPEN' | 'RESOLVED'): Promise<Chat[]> {
    return this.chatRepository.findAllChats(status);
  }
  async sendMessage(
    chatId: string,
    content: string | null,
    senderId: string,
    file?: Express.Multer.File
  ): Promise<ChatMessage> {
    const chat = await this.chatRepository.findChatById(chatId);
    if (!chat) throw new Error('Chat not found');
    let type: 'TEXT' | 'IMAGE' | 'VOICE' = 'TEXT';
    let url: string | undefined;
    if (file) {
      console.log('File received:', {
        mimetype: file.mimetype,
        size: file.size,
        originalname: file.originalname
      });
      try {
        const uploadResult = await new Promise<{
          secure_url: string;
          public_id: string;
          [key: string]: any; // لقبول بقية الخصائص الأخرى
        }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: file.mimetype.startsWith('/image') ? 'image' : 'video',
              folder: 'chat_media'
            },
            (error, result) => {
              if (error) reject(error);
              if (!result) return reject(new Error('Cloudinary upload result is undefined'));
              else resolve(result);
            }
          );
          //ضخ البيانات من السيرفر إلى السحاب مباشرة دون الحاجة لحفظ ملفات مؤقتة على سيرفر نود
          const bufferStream = new Readable();
          bufferStream.push(file);
          bufferStream.push(null);
          bufferStream.pipe(stream);
        });
        console.log('Cloudinary upload result:', uploadResult);
        type = file.mimetype.startsWith('image/') ? 'IMAGE' : 'VOICE';
        url = uploadResult.secure_url;
      } catch (error) {
        console.error('Cloudinary upload failed:', error);
        throw new Error('Failed to upload file');
      }
    }
    const message = await this.chatRepository.createMessage(chatId, senderId, content, type, url);
    this.io.to(`chat:${chatId}`).emit('newMessage', message);
    return message;
  }
  async updateChatStatus(chatId: string, status: 'OPEN' | 'RESOLVED'): Promise<Chat> {
    const chat = await this.chatRepository.updateChatStatus(chatId, status);
    this.io.to('admin').emit('chatStatusUpdated', chat);
    return chat;
  }
}
