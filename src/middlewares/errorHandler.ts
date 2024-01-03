import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.log(err.stack);
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal server error";

	res.status(statusCode).json({
		error: {
			message: message,
			statusCode: statusCode,
		},
	});
};

export default errorHandler;
