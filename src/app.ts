import dotenv from 'dotenv';
import Fastify from 'fastify';
import healthRoutes from './modules/global/health.route.js';
import userRoutes from './modules/user/user.route.js';
import { errorHandler } from './plugins/error-handler.js';

dotenv.config();

const app = Fastify({ logger: true });

app.setErrorHandler(errorHandler);

app.register(userRoutes, { prefix: '/api/v1/users' });
app.register(healthRoutes, { prefix: '/api/v1/health' });

async function main() {
	try {
		await app.listen({ port: Number(process.env.PORT), host: '0.0.0.0' });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

main();
