import { Request, Response } from "express";

class HolaMundoController {
	public index(req: Request, res: Response) {
		res.status(200).json({
			message: "Hola mundo",
		});
	}
}

export default HolaMundoController;
