import type { FastifyInstance } from 'fastify';

async function healthRoutes(app: FastifyInstance) {
	app.route({
		method: 'GET',
		url: '/',
		handler: async (request, reply) => {
			return reply.send({
				status: 'ok!',
				timestamp: new Date().toISOString(),
				uptime: process.uptime(),
			});
		},
	});
}

export default healthRoutes;
