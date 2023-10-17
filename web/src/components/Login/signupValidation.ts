import { z } from 'zod';

export const signupSchema = z.object({
	username: z.string().min(3).max(20),
	email: z.string().email(),
	password: z.string().min(6),
});

// Create a type alias for the form data
export type SignupFormData = z.infer<typeof signupSchema>;

// validate form data
export const validateSignupForm = (data: SignupFormData) => {
	try {
		// Attempt to parse and validate the data using the schema
		const parsedData = signupSchema.parse(data);

		return {
			success: true,
			data: parsedData,
		};
	} catch (error: any) {
		// Zod throws an error if validation fails
		return {
			success: false,
			error: error.message,
		};
	}
};
