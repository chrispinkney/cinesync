'use client';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useGlobalContext } from '@/context/store';
import { sendFriendRequest } from '@/utils/cinesync-api/fetch-user';

const FriendsAdd = ({ getFriends }: { getFriends: () => void }) => {
	const { token } = useGlobalContext();
	const [usernameFriend, setUsernameFriend] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarStatus, setSnackbarStatus] = useState({
		error: true,
		message: 'Error message',
	});

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsernameFriend(event.target.value);
	};

	const handleAddFriend = async () => {
		if (usernameFriend.length < 3) {
			setOpenSnackbar(true);
			setSnackbarStatus({
				error: true,
				message: 'Username must be at least 3 characters long',
			});
		} else {
			const { success, fetchResponseJson } = await sendFriendRequest({
				token: token,
				body: { username: usernameFriend },
			});

			if (success) {
				getFriends();
				setOpenSnackbar(true);
				setSnackbarStatus({
					error: false,
					message: 'Friend added successfully!',
				});
				setUsernameFriend('');
			}
			if ('message' in fetchResponseJson) {
				setOpenSnackbar(true);
				setSnackbarStatus({
					error: true,
					message: fetchResponseJson.message || '',
				});
			}
		}
	};

	return (
		<>
			<Grid
				sx={{
					display: 'flex',
					justifyContent: { xs: 'center', lg: 'right' },
					alignItems: 'center',
				}}
				xs={12}
				sm={12}
				md={12}
				lg={4}
				xl={4}
			>
				<TextField
					id="add-friends-box"
					label="User Name"
					variant="outlined"
					onChange={handleTextChange}
					value={usernameFriend}
				/>
			</Grid>
			<Grid
				sx={{
					display: 'flex',
					justifyContent: { xs: 'center', lg: 'left' },
					alignItems: 'center',
					marginLeft: '1vw',
				}}
				xs={12}
				sm={12}
				md={12}
				lg={4}
				xl={4}
			>
				<Tooltip title="Add friend">
					<Fab color="primary" aria-label="add" onClick={handleAddFriend}>
						<GroupAddIcon />
					</Fab>
				</Tooltip>
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
		</>
	);
};

export default FriendsAdd;
