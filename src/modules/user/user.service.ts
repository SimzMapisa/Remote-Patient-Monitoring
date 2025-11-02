import prisma from '../../config/db.js';
import { ConflictError, NotFoundError } from '../../plugins/errors.js';
import { hashPassword } from '../../utils/password-hash.js';

/** Controller to create a user
 * @param data - user data
 * @returns created user object
 * @throws Error if user already exists or on failure
 */

export async function createUserService(data: { name: string; email: string; password: string }) {
	const existingUser = await prisma.user.findUnique({
		where: { email: data.email },
	});
	if (existingUser) {
		throw new ConflictError('User with this email already exists', {
			field: 'email',
			value: data.email,
		});
	}

	const hashedPassword = await hashPassword(data.password);
	const user = await prisma.user.create({
		data: {
			...data,
			password: hashedPassword,
		},
	});

	return user;
}

/**
 * Fetch a user by ID
 * @param id integer user ID
 * @returns user object or null
 * @throws Error if user not found or on failure
 */
export async function getUserService(id: number) {
	if (!id || isNaN(id)) throw new Error('Invalid user ID');
	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (!user)
		throw new NotFoundError('User not found', {
			value: id,
			field: 'id',
		});

	return user;
}

export async function getAllUsersService() {
	return { message: 'getAllUsersService not implemented yet' };
}
