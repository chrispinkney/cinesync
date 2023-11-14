import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

const DeleteConfirmationDialog = ({
	open,
	deletionItemDescription,
	handleConfirm,
	handleCancel,
}: {
	open: boolean;
	deletionItemDescription: string;
	handleConfirm: () => void;
	handleCancel: () => void;
}) => {
	return (
		<>
			<Dialog open={open}>
				<DialogTitle>Delete Confirmation</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete {deletionItemDescription}?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleConfirm} color="error">
						Delete
					</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DeleteConfirmationDialog;
