import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import express, { Application } from "express";
import cors from "cors";

import { config } from "./config"; // aquí deberías tener PORT
import { setupChat } from "./sockets/chat.socket";
import { connectDatabase } from "./configDB";
import RouterChat from "./routes/chat.route";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Habilitar CORS para todas las rutas
app.use("/api/chat", RouterChat); // Rutas del chat

async function startServer() {
	// 1. Crear el servidor HTTP que envuelve Express
	const httpServer = createServer(app);

	// 2. Crear el servidor de WebSocket (Socket.IO) montado sobre httpServer
	const io = new IOServer(httpServer, {
		cors: {
			origin: "*", // o tu dominio frontend en producción
			methods: ["GET", "POST"],
		},
	});

	// 3. Inicializar sockets del chat
	setupChat(io);

	connectDatabase(); // Conectar a la base de datos

	// 4. Levantar el servidor HTTP+WebSocket
	const PORT = config.PORT || 3000;
	httpServer.listen(PORT, () => {
		console.log(`Servidor API + WebSocket corriendo en http://localhost:${PORT}`);
	});
}

startServer();

export default app;
