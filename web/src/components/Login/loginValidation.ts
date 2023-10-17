import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

// Create a type alias for the form data
export type LoginFormData = z.infer<typeof loginSchema>;

// validate form data
export const validateLoginForm = (data: LoginFormData) => {
	try {
		// Attempt to parse and validate the data using the schema
		const parsedData = loginSchema.parse(data);

		return {
			success: true,
			data: parsedData,
		};
	} catch (error: any) {
		// Zod throws an error if validation fails
		console.log(error);
		const testing = JSON.parse(error.message);

		return {
			success: false,
			error: error.message,
		};
	}
};
