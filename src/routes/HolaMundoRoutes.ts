import express from "express";
import HolaMundoController from "../controllers/HolaMundoController";

const route = express.Router();

const holaMundoController = new HolaMundoController();

route.get("/", holaMundoController.index);

export default route;
