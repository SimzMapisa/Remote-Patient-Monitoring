import type { FastifyInstance } from 'fastify';
import { createUserController, getUserController } from './user.controller.js';

async function userRoutes(app: FastifyInstance) {
	// app.post('/', createUserController);
	app.route({
		method: 'POST',
		url: '/',
		schema: {
			body: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					email: { type: 'string' },
					password: { type: 'string' },
				},
				required: ['name', 'email', 'password'],
				additionalProperties: false,
			},
			response: {
				201: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						email: { type: 'string' },
						id: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
			},
		},
		handler: createUserController,
	});

	app.route({
		method: 'GET',
		url: '/:id',
		schema: {
			params: {
				type: 'object',
				properties: {
					id: { type: 'string' },
				},
				required: ['id'],
				additionalProperties: false,
			},
			response: {
				200: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						name: { type: 'string' },
						email: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
			},
		},
		handler: getUserController,
	});
}

export default userRoutes;
