export class AppError extends Error {
	statusCode: number;
	details?: any;

	constructor(message: string, statusCode: number, details?: any) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ConflictError extends AppError {
	constructor(message = 'Resource already exists', details?: any) {
		super(message, 409, details);
	}
}

export class ValidationError extends AppError {
	constructor(message = 'Invalid input', details?: any) {
		super(message, 400, details);
	}
}

export class NotFoundError extends AppError {
	constructor(message = 'Resource not found', details?: any) {
		super(message, 404, details);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = 'Unauthorized access', details?: any) {
		super(message, 401, details);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = 'Forbidden access', details?: any) {
		super(message, 403, details);
	}
}

export class InternalServerError extends AppError {
	constructor(message = 'Internal server error', details?: any) {
		super(message, 500, details);
	}
}

export class BadRequestError extends AppError {
	constructor(message = 'Bad request', details?: any) {
		super(message, 400, details);
	}
}
