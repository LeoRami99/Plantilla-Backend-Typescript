import mongoose, { Schema, Document } from "mongoose";
export interface ChatMessage {
	id: string;
	userId: string;
	message: string;
	timestamp: Date;
}
type statusChat = "active" | "inactive" | "archived";

interface Accounts {
	primaryUser: string;
	secondaryUser: string;
}

export interface Chat extends Document {
	id: string;
	accounts: Accounts[];
	status: statusChat;
	chatMessages: ChatMessage[];
	createdAt: Date;
	updatedAt: Date;
}

const chatSchema = new Schema<Chat>({
	id: { type: String, required: true },
	status: { type: String, enum: ["active", "inactive", "archived"], default: "active" },
	accounts: [
		{
			primaryUser: { type: String, required: true },
			secondaryUser: { type: String, required: true },
		},
	],
	chatMessages: [
		{
			id: { type: String, required: true },
			userId: { type: String, required: true },
			message: { type: String, required: true },
			timestamp: { type: Date, default: Date.now },
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const ChatModel = mongoose.model<Chat>("Chat", chatSchema);
