'use client';
import { useUser } from '@/context/user.context';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadAvatarImage from './UploadAvatarImage';
import DeleteUserProfile from './DeleteUserProfile';
import ExportUserData from './ExportUserData';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { useState } from 'react';

const ProfileTop = () => {
	const userContext = useUser();
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
		useState<boolean>(false);

	const handleDeleteClick = () => {
		setDeleteConfirmationOpen(true);
	};

	const handleDeleteConfirm = () => {
		userContext.deleteAvatarUser();
		setDeleteConfirmationOpen(false);
	};

	return (
		<>
			<Grid container spacing={4} mb={4}>
				<Grid xs={2} justifyContent="left" alignItems="center">
					<Typography variant="h4" gutterBottom color="primary.main">
						User Profile
					</Typography>
					<Divider />
				</Grid>
				<ExportUserData />
			</Grid>
			<Grid container spacing={4} columns={12} pb={8}>
				<Grid xs={12} sm={12} md={9} lg={6} xl={2}>
					<Avatar
						alt="Avatar"
						src={userContext.avatar}
						sx={{
							maxWidth: 128,
							maxHeight: 128,
							width: '100%',
							height: '100%',
						}}
					/>
					<div style={{ marginTop: 10, display: 'flex' }}>
						<Button
							variant="contained"
							color="error"
							startIcon={<DeleteOutlineIcon />}
							onClick={handleDeleteClick}
							sx={{ maxWidth: 170, minWidth: 'auto' }}
							disabled={userContext.avatar == '' ? true : false}
						>
							Delete Avatar
						</Button>
					</div>
				</Grid>
				<Grid
					display="flex"
					alignItems="center"
					xs={12}
					sm={12}
					md={9}
					lg={6}
					xl={2}
				>
					<Typography variant="h6" gutterBottom sx={{ fontWeight: 'semibold' }}>
						{userContext.user.username}
					</Typography>
				</Grid>
				<Grid
					display="flex"
					justifyContent="center"
					alignItems="center"
					xs={12}
					sm={12}
					md={9}
					lg={6}
					xl={2}
				>
					<UploadAvatarImage />
				</Grid>
				<Grid
					display="flex"
					justifyContent="center"
					alignItems="center"
					xs={12}
					sm={12}
					md={9}
					lg={6}
					xl={2}
				>
					<DeleteUserProfile />
				</Grid>
			</Grid>
			<DeleteConfirmationDialog
				open={deleteConfirmationOpen}
				deletionItemDescription={`your user avatar`}
				handleConfirm={handleDeleteConfirm}
				handleCancel={() => setDeleteConfirmationOpen(false)}
			/>
		</>
	);
};

export default ProfileTop;
