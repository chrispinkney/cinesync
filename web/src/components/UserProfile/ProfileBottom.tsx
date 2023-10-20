'use client';
import { z } from 'zod';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { useUser } from '@/context/user.context';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/store';
import { updateUser } from '../../utils/cinesync-api/fetch-user';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Define Zod schemas for validation
const userSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must be at least 3 characters long' })
		.max(20, 'Username must be 20 characters long maximum')
		.optional(),
	email: z.string().email({ message: 'Invalid email address' }).optional(),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long' })
		.optional(),
});

const ProfileBottom = ({ refreshContext }: { refreshContext: () => void }) => {
	const context = useUser();
	const { token } = useGlobalContext();
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarStatus, setSnackbarStatus] = useState({
		error: true,
		message: 'Error message',
	});
	// will be used as default values for forms from context and empty password
	const [userContext, setUserContext] = useState({
		username: context.user.username,
		email: context.user.email,
		password: '',
	});

	//form data initialized to user context
	const [formData, setFormData] = useState({
		username: context.user.username,
		email: context.user.email,
		password: '',
	});

	const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmitData = async (e: React.FormEvent) => {
		e.preventDefault();

		// Remove fields with default values from the formData object
		const formDataToSubmit = { ...formData };
		for (const key in formData) {
			if ((formData as any)[key] === (userContext as any)[key]) {
				delete (formDataToSubmit as any)[key];
			}
		}

		if (Object.keys(formDataToSubmit).length != 0) {
			try {
				userSchema.parse(formDataToSubmit);
				const { success, fetchResponseJson } = await updateUser({
					token: token,
					body: formDataToSubmit,
				});

				if (success) {
					setUserContext({
						...userContext,
						...formDataToSubmit,
					});
					setSnackbarStatus({
						error: false,
						message: 'Account updated successfully!',
					});
					setOpenSnackbar(true);
				}
			} catch (error: any) {
				let zodErrMsgs = '';
				JSON.parse(error.message).forEach((errMsg: any) => {
					zodErrMsgs += '\n' + errMsg.message + '!\n';
				});
				setSnackbarStatus({
					error: true,
					message: zodErrMsgs,
				});
				setOpenSnackbar(true);
			}
		} else {
			setSnackbarStatus({
				error: true,
				message: 'Please change at least one of the fields!',
			});
			setOpenSnackbar(true);
		}
	};

	return (
		<>
			<Grid container spacing={4} pb={4} pt={4}>
				<Grid xs={6} lg={4} xl={3}>
					<div style={{ width: '30%' }}>
						<Typography
							variant="h5"
							gutterBottom
							color={'lightblue'}
							sx={{ fontWeight: 'semibold' }}
						>
							User Profile
						</Typography>
						<Divider />
					</div>
				</Grid>
			</Grid>
			<form onSubmit={handleSubmitData}>
				<Grid container spacing={4} columns={12}>
					<Grid xs={12} sm={12} md={9} lg={6} xl={3}>
						<TextField
							margin="dense"
							name="username"
							value={formData.username}
							onChange={handleUserDataChange}
							label="Username"
							type="text"
							fullWidth
						/>
					</Grid>
					<Grid xs={12} sm={12} md={9} lg={6} xl={3}>
						<TextField
							margin="dense"
							name="email"
							value={formData.email}
							onChange={handleUserDataChange}
							label="Email Address"
							type="email"
							fullWidth
						/>
					</Grid>
					<Grid xs={12} sm={12} md={9} lg={6} xl={3}>
						<TextField
							margin="dense"
							name="password"
							value={formData.password}
							onChange={handleUserDataChange}
							label="Password"
							type="password"
							fullWidth
						/>
					</Grid>
					<Grid
						xs={12}
						sm={12}
						md={9}
						lg={6}
						xl={3}
						display="flex"
						justifyContent="center"
						alignItems="center"
					>
						<Fab size="small" aria-label="save user data" type="submit">
							<SaveIcon />
						</Fab>
					</Grid>
					<Snackbar
						open={openSnackbar}
						autoHideDuration={6000}
						onClose={() => {
							setOpenSnackbar(false);
						}}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					>
						{snackbarStatus.error ? (
							<Alert
								onClose={() => {
									setOpenSnackbar(false);
								}}
								severity="error"
								sx={{ width: '100%' }}
							>
								{snackbarStatus.message}
							</Alert>
						) : (
							<Alert
								onClose={() => {
									setOpenSnackbar(false);
								}}
								severity="success"
								sx={{ width: '100%' }}
							>
								{snackbarStatus.message}
							</Alert>
						)}
					</Snackbar>
				</Grid>
			</form>
		</>
	);
};

export default ProfileBottom;
