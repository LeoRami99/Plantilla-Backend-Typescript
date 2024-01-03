import dotenv from "dotenv";

dotenv.config();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	// tus configuraciones de conexión a la base de datos aquí
	dialect: "mysql",
	host: "localhost",
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

export { sequelize };
