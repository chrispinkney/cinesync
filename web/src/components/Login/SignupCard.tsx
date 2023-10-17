import { useState } from 'react';
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

const SignupCard = () => {
	const [formData, setFormData] = useState<SignupFormData>({
		username: '',
		email: '',
		password: '',
	});

	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationResult = validateSignupForm(formData);

		if (validationResult.success) {
			try {
				// Send the form data to the backend API
				const response = await fetch('http://localhost:3000/auth/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(validationResult.data),
				});

				if (response.ok) {
					// need to add alert that account has been created
				} else {
					const errorData = await response.json();
					setError(errorData.message || 'An error occurred during signup.');
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
