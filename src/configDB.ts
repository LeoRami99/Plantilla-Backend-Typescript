// import dotenv from "dotenv";

// dotenv.config();
// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize({
// 	// tus configuraciones de conexión a la base de datos aquí
// 	dialect: "mysql",
// 	host: "localhost",
// 	username: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_NAME,
// });

// export { sequelize };

import mongoose from "mongoose";
import { config } from "./config";

export async function connectDatabase() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		console.log("🛢️ Conectado exitosamente a MongoDB");
	} catch (error) {
		console.error("❌ Error al conectar a MongoDB:", error);
		process.exit(1); // Cierra la app si no conecta
	}
}
