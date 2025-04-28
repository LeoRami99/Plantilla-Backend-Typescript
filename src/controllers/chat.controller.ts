import { Server, Socket } from "socket.io";
import ChatService from "../services/chat.service";

export class ChatController {
	private chatService: ChatService;

	constructor(private io: Server) {
		this.chatService = new ChatService();
	}

	async setupSocket(socket: Socket) {
		const { chatID, userID, secondIdUser } = socket.handshake.query as {
			chatID?: string;
			userID: string;
			secondIdUser?: string;
		};

		console.log(`Usuario conectado: ${userID} al chat: ${chatID || "sin chat específico"}`);

		if (!userID) {
			console.warn("Falta userID, no se puede conectar");
			socket.emit("error", { message: "Missing userID" });
			return;
		}
		if (chatID) {
			socket.join(chatID);

			let chat = await this.chatService.getChatById(chatID);

			if (!chat) {
				// Solo crear chat si también tenemos secondIdUser
				if (!secondIdUser) {
					console.warn("No se puede crear chat: falta secondIdUser");
					socket.emit("error", { message: "Missing secondIdUser to create chat" });
					return;
				}

				console.log(`Chat ${chatID} no existe, creando nuevo chat...`);

				chat = await this.chatService.createChat({
					id: chatID,
					accounts: [{ primaryUser: userID, secondaryUser: secondIdUser }],
					status: "active",
					chatMessages: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}

			socket.emit("history", chat.chatMessages);

			// Escuchar envío de mensajes
			socket.on("send_message", async (data) => {
				const { text } = data;

				if (!chat) {
					console.warn(`No se encontró el chat para enviar mensaje.`);
					return;
				}

				// 🚀 Detectar comando especial /get-pay 200 COP
				if (text.startsWith("/gen-pay")) {
					const [, amount, currency] = text.split(" ");

					if (!amount || !currency) {
						console.warn("Formato inválido en /get-pay, faltan parámetros.");
						socket.emit("error", { message: "Formato inválido. Usa: /get-pay 200 COP" });
						return;
					}

					console.log(`Solicitud de pago detectada: ${amount} ${currency} por ${userID}`);

					this.io.to(chatID).emit("payment_requested", {
						amount,
						currency,
						requester: userID,
					});

					// 🚫 No guardar el comando como mensaje normal en el historial
					return;
				}

				// 🎯 Si no es comando, enviar el mensaje como normal
				const message = {
					id: `${Date.now()}`,
					userId: userID,
					message: text,
					timestamp: new Date(),
				};

				await this.chatService.addMessage(chatID, message);

				this.io.to(chatID).emit("receive_message", message);

				// Refrescar participantes
				const participants = chat.accounts.map((acc) => [acc.primaryUser, acc.secondaryUser]).flat();
				for (const participantId of participants) {
					if (participantId) {
						for (const [_, s] of this.io.sockets.sockets.entries()) {
							if (s.handshake.query.userID === participantId) {
								s.emit("refresh_chats");
							}
						}
					}
				}
			});
			socket.on("request_payment", async (data) => {
				const { amount, currency } = data;

				console.log(`Solicitud de pago de ${amount} ${currency} por el usuario ${userID}`);

				this.io.to(chatID).emit("payment_requested", {
					amount,
					currency,
					requester: userID,
				});
			});
		}

		// Escuchar petición de lista de chats
		socket.on("list_chats", async () => {
			const chats = await this.chatService.getChatsForUser(userID);
			socket.emit("update_chats", chats);
		});

		socket.on("disconnect", () => {
			console.log("Usuario desconectado:", socket.id);
		});
	}
}
