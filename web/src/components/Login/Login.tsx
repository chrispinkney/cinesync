import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { Fragment, useState } from 'react';

// Temporary login to get cookies for list fetching
const Login = () => {
	const [loggingIn, setLoggingIn] = useState(false);
	const [success, setSuccess] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [errorText, setErrorText] = useState('');

	const handleClose = (
		_event: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);
	};

	return (
		<Fragment>
			<Button
				variant="contained"
				disabled={loggingIn}
				onClick={async () => {
					setLoggingIn(true);
					const response = await fetch(
						`${process.env.NEXT_PUBLIC_URL}/auth/signin`,
						{
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							mode: 'cors',
							credentials: 'include',
							body: JSON.stringify({
								email: 'test@test.test',
								password: 'test',
							}),
						},
					);
					if (response.ok) {
						setSuccess(true);
					} else {
						setSuccess(false);
						setErrorText(`${response.status} - ${response.statusText}`);
					}
					setSnackbarOpen(true);
					setLoggingIn(false);
				}}
			>
				Login
			</Button>
			{loggingIn && <CircularProgress />}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert
					onClose={handleClose}
					severity={success ? 'success' : 'error'}
					sx={{ width: '100%' }}
				>
					{success
						? 'Logged in successfully'
						: `Login attempt failed: ${errorText}`}
				</Alert>
			</Snackbar>
		</Fragment>
	);
};

export default Login;
