import ChatService from "../services/chat.service";
import { Request, Response } from "express";

export class ChatHttpController {
	chatService = new ChatService();

	deleteChatController = async (req: Request, res: Response) => {
		console.log("deleteChatController");
		const { chatId } = req.params;

		try {
			const chat = await this.chatService.getChatById(chatId);

			if (!chat) {
				return res.status(404).json({ message: "Chat not found" });
			}

			await this.chatService.deleteChat(chatId);
			return res.status(200).json({ message: "Chat deleted successfully" });
		} catch (error) {
			console.error("Error deleting chat:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	};
}
