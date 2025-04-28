import { Server } from "socket.io";
import { ChatController } from "../controllers/chat.controller";

export function setupChat(io: Server) {
	const chatController = new ChatController(io);

	// Cuando un cliente se conecta
	io.on("connection", (socket) => {
		console.log("Cliente conectado:", socket.id);

		chatController.setupSocket(socket); // Configura los eventos por cliente
	});
}
