import { Dispatch, SetStateAction, useState } from 'react';
import { NextPage } from 'next';
import { validateSignupForm, SignupFormData } from './signupValidation';
import {
	CardContent,
	Container,
	Typography,
	TextField,
	Button,
} from '@mui/material';
import styles from './authMain.module.css';
import Image from 'next/image';
import { signUserUp } from '@/utils/cinesync-api/fetch-user';

interface SignUpProps {
	settabValue: Dispatch<SetStateAction<number>>;
}

const SignupCard: NextPage<SignUpProps> = ({ settabValue }) => {
	const [formData, setFormData] = useState<SignupFormData>({
		username: '',
		email: '',
		password: '',
	});

	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationResult = validateSignupForm(formData);

		if (validationResult.success && validationResult.data) {
			try {
				// Send the form data to the backend API
				const { success, fetchResponseJson } = await signUserUp({
					body: validationResult.data,
				});

				if (success) {
					settabValue(0);
					// need to add alert that account has been created
				} else {
					if ('message' in fetchResponseJson)
						setError(
							fetchResponseJson.message || 'An error occurred during signup.',
						);
				}
			} catch (error: any) {
				setError('An error occurred during signup.');
			}
		} else {
			setError(validationResult.error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	return (
		<>
			<CardContent>
				<div className={styles.cardContainer}>
					<Image
						src="/cinesync-logo-dark.svg"
						height={54}
						width={150}
						alt="CineSync Logo"
						style={{ margin: '1px' }}
					/>
					<Container maxWidth="xs">
						{error && <Typography color="error">{error}</Typography>}
						<form onSubmit={handleSubmit}>
							<TextField
								fullWidth
								label="Username"
								type="text"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								margin="normal"
								variant="outlined"
								required
							/>
							<TextField
								fullWidth
								label="Email"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								margin="normal"
								variant="outlined"
								required
							/>
							<TextField
								fullWidth
								label="Password"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								margin="normal"
								variant="outlined"
								required
							/>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								size="large"
								style={{ marginTop: '16px' }}
							>
								Sign Up
							</Button>
						</form>
					</Container>
				</div>
			</CardContent>
		</>
	);
};

export default SignupCard;
