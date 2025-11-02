import bcrypt from 'bcryptjs';
const salt = 10;

export async function hashPassword(password: string): Promise<string> {
	if (!password) throw Error('Password is required');
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	if (!password || !hashedPassword) throw new Error('Both password and hashedPassword are required');
	return await bcrypt.compare(password, hashedPassword);
}
