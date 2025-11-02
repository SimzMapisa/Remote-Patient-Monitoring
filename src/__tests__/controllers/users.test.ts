import type { FastifyReply, FastifyRequest } from 'fastify';
import { describe, expect, test, vi, type Mock } from 'vitest';
import { createUserController, getAllUsersController, getUserController } from '../../modules/user/user.controller.js';
import { createUserService, getAllUsersService, getUserService } from '../../modules/user/user.service.js';
import type { CreateUserBody, GetUserParams } from '../../utils/interfaces.js';

vi.mock('../../modules/user/user.service.js'); // mock service

describe('Create User Controller', () => {
	test('should return 201 and user data', async () => {
		const mockUser = { id: '123', email: 'test@example.com', password: 'hashed' };
		(createUserService as Mock).mockResolvedValue(mockUser);

		const req = { body: { name: 'Test User', email: 'test@example.com', password: 'secret' } } as FastifyRequest<{
			Body: CreateUserBody;
		}>;
		const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as FastifyReply;

		await createUserController(req, reply);

		expect(reply.status).toHaveBeenCalledWith(201);
		expect(reply.send).toHaveBeenCalledWith(mockUser);
	});

	test('should return 400 if required fields are missing', async () => {
		const req = { body: { email: 'test@example.com', password: 'secret' } } as FastifyRequest<{
			Body: CreateUserBody;
		}>;
		const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as FastifyReply;

		await createUserController(req, reply);

		expect(reply.status).toHaveBeenCalledWith(400);
		expect(reply.send).toHaveBeenCalledWith({ error: 'Name is required' });
	});
});

describe('Get User by ID Controller', () => {
	test('should return user data if found', async () => {
		const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
		(getUserService as Mock).mockResolvedValue(mockUser);

		const req = { params: { id: '1' } } as FastifyRequest<{ Params: GetUserParams }>;
		const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as FastifyReply;
		await getUserController(req, reply);

		expect(reply.status).toHaveBeenCalledWith(200);
		expect(reply.send).toHaveBeenCalledWith(mockUser);
	});
	test('should return 404 if user not found', async () => {
		(getUserService as Mock).mockResolvedValue(null);
		const req = { params: { id: '999' } } as FastifyRequest<{ Params: GetUserParams }>;
		const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as FastifyReply;
		await getUserController(req, reply);

		expect(reply.status).toHaveBeenCalledWith(404);
		expect(reply.send).toHaveBeenCalledWith({ error: 'User not found' });
	});

	test('should return 400 if ID is missing', async () => {
		const req = { params: {} } as FastifyRequest<{ Params: GetUserParams }>;
		const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as FastifyReply;
		await getUserController(req, reply);
		expect(reply.status).toHaveBeenCalledWith(400);
		expect(reply.send).toHaveBeenCalledWith({ error: 'User ID is required' });
	});
});

describe('Get All Users Controller', () => {
	test('should return a list of users', async () => {
		const mockUsers = [
			{ id: 1, name: 'Test User 1', email: 'test1@example.com' },
			{ id: 2, name: 'Test User 2', email: 'test2@example.com' },
		];
		(getAllUsersService as Mock).mockResolvedValue(mockUsers);

		const req = {} as FastifyRequest;
		const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as FastifyReply;

		await getAllUsersController(req, reply);

		expect(reply.status).toHaveBeenCalledWith(200);
		expect(reply.send).toHaveBeenCalledWith(mockUsers);
	});
});
