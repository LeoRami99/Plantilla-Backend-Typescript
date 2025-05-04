import { Router } from "express";

import { ChatHttpController } from "../controllers/chat.http.controller";

const router = Router();
const chatHttpController = new ChatHttpController();

router.delete("/:chatId", chatHttpController.deleteChatController); // Eliminar un chat

export default router;
