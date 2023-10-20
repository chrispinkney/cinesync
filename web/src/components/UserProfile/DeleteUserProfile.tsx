'use client';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { useGlobalContext } from '@/context/store';
import { useUser } from '@/context/user.context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUser } from '@/utils/cinesync-api/fetch-user';

const DeleteUserProfile = () => {
	const router = useRouter();
	const userContext = useUser();
	const { token } = useGlobalContext();
	const [openModal, setOpenModal] = useState(false);
	const [deleteEmail, setDeleteEmail] = useState('');

	// Deletion Modal functionality
	const handleClickOpen = () => {
		setOpenModal(true);
	};

	const handleClose = () => {
		setOpenModal(false);
		setDeleteEmail('');
	};

	const handleDeleteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDeleteEmail(e.target.value);
	};

	const handleDelete = async () => {
		const { success, fetchResponseJson } = await deleteUser({
			token: token,
		});
		if (success) {
			router.push('/signout');
		}
	};

	return (
		<Grid>
			<div
				style={{
					textAlign: 'center',
					position: 'relative',
					top: '30%',
				}}
			>
				<Button variant="outlined" color="error" onClick={handleClickOpen}>
					Delete Profile
				</Button>
				<Dialog open={openModal} onClose={handleClose}>
					<DialogTitle>Delete profile?</DialogTitle>
					<DialogContent>
						<DialogContentText>
							You are about to delete your profile.
							<br /> If you are sure about this type <br />
							<strong style={{ fontWeight: 'bold', color: 'red' }}>
								{userContext.user.email}
							</strong>
							<br />
							in the space below and click delete.
							<br />
							<i>This action is irreversible!</i>
						</DialogContentText>
						<TextField
							margin="dense"
							name="email"
							onChange={handleDeleteInputChange}
							label="Email Address"
							type="email"
							fullWidth
							variant="standard"
						/>
					</DialogContent>
					<DialogActions>
						<Button color="success" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							color="error"
							onClick={handleDelete}
							disabled={deleteEmail == userContext.user.email ? false : true}
						>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</Grid>
	);
};

export default DeleteUserProfile;
