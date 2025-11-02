export interface CreateUserBody {
	name: string;
	email: string;
	password: string;
}

export interface GetUserParams {
	id: string;
}

export interface ErrorResponse {
	statusCode: number;
	error: string;
	message: string;
	timestamp: string;
	path: string;
	details?: any;
}
