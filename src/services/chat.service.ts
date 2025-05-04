import { ChatModel, Chat } from "../models/chat.model";

export default class ChatService {
	async getChatById(chatId: string): Promise<Chat | null> {
		try {
			const chat = await ChatModel.findOne({ id: chatId }).exec();
			return chat; // Puede devolver null si no existe y está perfecto
		} catch (error) {
			console.error("Error fetching chat:", error);
			throw new Error("Database error while fetching chat");
		}
	}

	async createChat(chatData: Partial<Chat>): Promise<Chat> {
		try {
			const chat = new ChatModel(chatData);
			await chat.save();
			return chat;
		} catch (error) {
			console.error("Error creating chat:", error);
			throw new Error("Database error while creating chat");
		}
	}

	async updateChat(chatId: string, chatData: Partial<Chat>): Promise<Chat | null> {
		try {
			const chat = await ChatModel.findOneAndUpdate({ id: chatId }, chatData, { new: true }).exec();
			return chat;
		} catch (error) {
			console.error("Error updating chat:", error);
			throw new Error("Database error while updating chat");
		}
	}

	async addMessage(chatId: string, message: any): Promise<Chat | null> {
		try {
			const chat = await ChatModel.findOne({ id: chatId });
			if (!chat) throw new Error("Chat not found");

			chat.chatMessages.push(message);
			chat.updatedAt = new Date();
			await chat.save();
			return chat;
		} catch (error) {
			console.error("Error adding message to chat:", error);
			throw new Error("Database error while adding message");
		}
	}

	async getChatsForUser(userId: string): Promise<Chat[]> {
		try {
			const chats = await ChatModel.find({
				$or: [{ "accounts.primaryUser": userId }, { "accounts.secondaryUser": userId }],
			})
				.sort({ updatedAt: -1 }) // 🎯 Ordenamos por el chat más reciente
				.exec();

			return chats;
		} catch (error) {
			console.error(`Error fetching chats for user ${userId}:`, error);
			throw new Error("Failed to fetch user's chats from the database");
		}
	}

	async deleteChat(chatId: string): Promise<void> {
		try {
			await ChatModel.deleteOne({ id: chatId }).exec();
		} catch (error) {
			console.error("Error deleting chat:", error);
			throw new Error("Database error while deleting chat");
		}
	}
}
