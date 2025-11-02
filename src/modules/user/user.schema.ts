import { z } from 'zod';

export const createUserSchema = z.object({
	name: z.string({ message: 'Name is required' }).min(1, 'Name must be at least 1 character long'),
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});
