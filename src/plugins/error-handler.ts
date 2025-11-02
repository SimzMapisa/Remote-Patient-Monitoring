import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '../generated/prisma/wasm.js';
import type { ErrorResponse } from '../utils/interfaces.js';
import { AppError } from './errors.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
	const timestamp = new Date().toISOString();
	const path = request.url;

	// Helper function to create standardized error response
	const createErrorResponse = (
		statusCode: number,
		errorName: string,
		message: string,
		details?: any
	): ErrorResponse => ({
		statusCode,
		error: errorName,
		message,
		timestamp,
		path,
		...(details && { details }),
	});

	// Handle custom application errors
	if (error instanceof AppError) {
		const errorName = error.name.replace('Error', ''); // ConflictError -> Conflict
		return reply
			.status(error.statusCode)
			.send(createErrorResponse(error.statusCode, errorName, error.message, error.details));
	}

	// Prisma validation errors
	if (error instanceof Prisma.PrismaClientValidationError) {
		return reply.status(400).send(
			createErrorResponse(400, 'ValidationError', 'Invalid data for database operation', {
				type: 'PrismaValidation',
			})
		);
	}

	// Prisma unique constraint violation
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case 'P2002':
				return reply.status(409).send(
					createErrorResponse(409, 'Conflict', 'A record with this value already exists', {
						code: error.code,
						field: error.meta?.target,
					})
				);
			case 'P2025':
				return reply.status(404).send(
					createErrorResponse(404, 'NotFound', 'Record not found', {
						code: error.code,
					})
				);
			default:
				return reply.status(400).send(
					createErrorResponse(400, 'DatabaseError', 'Database operation failed', {
						code: error.code,
					})
				);
		}
	}

	// Prisma connection / initialization errors
	if (error instanceof Prisma.PrismaClientInitializationError) {
		return reply.status(503).send(
			createErrorResponse(503, 'ServiceUnavailable', 'Database connection failed', {
				type: 'DatabaseConnection',
			})
		);
	}

	if (error instanceof Prisma.PrismaClientRustPanicError) {
		return reply.status(500).send(
			createErrorResponse(500, 'InternalServerError', 'Database engine crashed', {
				type: 'DatabasePanic',
			})
		);
	}

	// Fastify validation errors
	if (error.validation) {
		return reply.status(400).send(
			createErrorResponse(400, 'ValidationError', 'Request validation failed', {
				validation: error.validation,
			})
		);
	}

	// Fallback for everything else
	request.log.error(error);
	const statusCode = error.statusCode || 500;
	return reply
		.status(statusCode)
		.send(
			createErrorResponse(
				statusCode,
				'InternalServerError',
				process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
				process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
			)
		);
}
