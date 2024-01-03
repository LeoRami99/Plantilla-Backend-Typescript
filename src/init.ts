import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

// manejador de erroes de la api
import errorHandler from "./middlewares/errorHandler";
// morgan para ver las peticiones que llegan al servidor
import morgan from "morgan";

/* Lista de importaciones de rutas para la api */
import HolaMundoRoutes from "./routes/HolaMundoRoutes";

dotenv.config();

const API_VERSION = "/api/v1";

const app: Application = express();

// uso de las rutas de la api

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(morgan("dev"));
// lista de rutas
app.use(`${API_VERSION}`, HolaMundoRoutes);
// Static files
const staticFilesPath = process.env.STATIC_FILES_PATH || "src/public";
console.log(staticFilesPath);
app.use(`${API_VERSION}/static`, express.static(staticFilesPath));
export default app;
