import {
	CardContent,
	Container,
	Typography,
	TextField,
	Button,
} from '@mui/material';
import { useState } from 'react';
import { LoginFormData, validateLoginForm } from './loginValidation';
import styles from './authMain.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/store';

const LoginCard = () => {
	const { token, setToken } = useGlobalContext();
	const router = useRouter();
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});

	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationResult = validateLoginForm(formData);

		if (validationResult.success) {
			try {
				// Send the form data to the backend API for authentication
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_URL}/auth/signin` ||
						'http://localhost:3000/auth/signin',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(validationResult.data),
					},
				);
				const login_token = await response.json();
				const headers = { Authorization: `Bearer ${login_token.accessToken}` };
				setToken(headers.Authorization);
				localStorage.setItem('token', headers.Authorization);

				if (response.ok) {
					// redirect to dashboard
					router.push('/dashboard');
				} else {
					const errorData = await response.json();
					setError(errorData.message || 'Login failed.');
				}
			} catch (error: any) {
				setError('An error occurred during login.');
			}
		} else {
			setError(validationResult.error);
			// need to refactor below to spit out only a string.
			const testing = JSON.parse(validationResult.error);
			Object.values(testing).map((errM: any) => console.log(errM.message));
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
								Log In
							</Button>
						</form>
					</Container>
				</div>
			</CardContent>
		</>
	);
};

export default LoginCard;
