export interface SystemResponse<T> {
	code: number;
	message: string;
	data: T;
	count?: number;
	errors?: SystemError[];
}

export interface SystemError {
	code: number;
	message: string;
}
