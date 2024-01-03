import express, { Application } from "express";
import cors from "cors";

// manejador de erroes de la api
import errorHandler from "./middlewares/errorHandler";
// morgan para ver las peticiones que llegan al servidor
import morgan from "morgan";

/* Lista de importaciones de rutas para la api */
import HolaMundoRoutes from "./routes/HolaMundoRoutes";

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
app.use(`${API_VERSION}/public`, express.static("src/uploads"));
export default app;
