import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserBody, GetUserParams } from '../../utils/interfaces.js';
import { createUserSchema } from './user.schema.js';
import { createUserService, getAllUsersService, getUserService } from './user.service.js';

/**
 * Controller to handle user creation
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * returns - Sends response with created user or error message
 * description: This controller handles the creation of a new user. It expects the request body to contain the user's name, email, and password. If the user is successfully created, it returns the user data with a 201 status code. If there are any errors, it returns a 400 status code with an appropriate error message.
 */

export async function createUserController(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
	const data = request.body;
	const validatedData = createUserSchema.safeParse(data);

	if (!validatedData.success) return reply.status(400).send({ error: validatedData.error.issues[0]?.message });

	const user = await createUserService(validatedData.data);

	if (!user) return reply.status(400).send({ error: 'Failed to create user' });

	return reply.status(201).send(user);
}

/** * Controller to handle fetching a user by ID
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * returns - Sends response with user data or error message
 * description: This controller retrieves a user by their ID. It expects the ID to be provided in the request parameters. If the user is found, it returns the user data; otherwise, it returns an appropriate error message.
 */

export async function getUserController(request: FastifyRequest<{ Params: GetUserParams }>, reply: FastifyReply) {
	const { id } = request.params;
	if (!id) return reply.status(400).send({ error: 'User ID is required' });
	const user = await getUserService(parseInt(id, 10));
	if (!user) return reply.status(404).send({ error: 'User not found' });
	return reply.status(200).send(user);
}

//TODO - implement the following controllers:

/** Controller to get all users
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * returns - Sends response with list of users or error message
 * description: This controller retrieves all users from the database. It does not require any parameters. If successful, it returns a list of users; otherwise, it returns an appropriate error message.
 */

export async function getAllUsersController(request: FastifyRequest, reply: FastifyReply) {
	const users = await getAllUsersService();

	return reply.status(200).send(users);
}

/** Controller to create user profile
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * returns - Sends response with created profile or error message
 * description: This controller handles the creation of a user profile. It expects the request body to contain profile details. If the profile is successfully created, it returns the profile data; otherwise, it returns an appropriate error message.
 */

export async function createUserProfileController(request: FastifyRequest, reply: FastifyReply) {
	return reply.status(201).send({ message: 'Create user profile controller - to be implemented' });
}

/** Controller to get user profile by user ID
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * returns - Sends response with user profile data or error message
 * description: This controller retrieves a user profile by the user's ID. It expects the ID to be provided in the request parameters. If the profile is found, it returns the profile data; otherwise, it returns an appropriate error message.
 */
export async function getUserProfileController(request: FastifyRequest, reply: FastifyReply) {
	return reply.status(200).send({ message: 'Get user profile controller - to be implemented' });
}

/** Controller to update user profile by user ID
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * returns - Sends response with updated profile or error message
 * description: This controller updates a user profile by the user's ID. It expects the ID to be provided in the request parameters and the updated profile details in the request body. If the profile is successfully updated, it returns the updated profile data; otherwise, it returns an appropriate error message.
 */
export async function updateUserProfileController(request: FastifyRequest, reply: FastifyReply) {
	return reply.status(200).send({ message: 'Update user profile controller - to be implemented' });
}

/** Controller to delete user profile by user ID
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * returns - Sends response with deletion status or error message
 * description: This controller deletes a user profile by the user's ID. It expects the ID to be provided in the request parameters. If the profile is successfully deleted, it returns a success message; otherwise, it returns an appropriate error message.
 */
export async function deleteUserProfileController(request: FastifyRequest, reply: FastifyReply) {
	return reply.status(200).send({ message: 'Delete user profile controller - to be implemented' });
}
