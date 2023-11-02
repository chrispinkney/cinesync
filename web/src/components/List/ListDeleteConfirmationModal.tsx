'use client';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useGlobalContext } from '@/context/store';
import { deleteList } from '@/utils/cinesync-api/fetch-list';

const ListDeleteConfirmationModal = ({
	open,
	handleClose,
	listId,
	refreshContext,
	name,
}: {
	open: boolean;
	handleClose: () => void;
	listId: string;
	refreshContext: () => Promise<void>;
	name: string;
}) => {
	const { replace } = useRouter();
	const pathname = usePathname();
	const { token } = useGlobalContext();

	const [errorText, setErrorText] = useState('');

	const handleSubmit = async () => {
		// Send delete request to api
		const { success, fetchResponseJson } = await deleteList({
			token: token,
			listId: listId,
		});
		if (!success) {
			setErrorText(
				`Unable to delete list: ${
					'message' in fetchResponseJson ? fetchResponseJson.message : 'unknown'
				}`,
			);
		} else {
			setErrorText('');
			handleClose();
			// Redirect to /dashboard
			if (pathname == '/dashboard') {
				refreshContext();
			} else {
				replace('/dashboard');
			}
		}
	};
	const handleCancel = () => {
		setErrorText('');
		handleClose();
	};

	return (
		<Modal open={open} onClose={handleCancel}>
			<Box
				sx={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					bgcolor: 'background.paper',
					boxShadow: 24,
					p: 4,
				}}
			>
				<Typography variant="h5" gutterBottom align="center">
					Delete List
				</Typography>
				<Divider />
				<Typography variant="body1" gutterBottom sx={{ margin: 5 }}>
					Are you sure you wish to delete list {name}?
				</Typography>
				<Box display="flex" justifyContent="center" alignItems="center">
					<ButtonGroup variant="contained">
						<Button onClick={handleSubmit}>Confirm</Button>
						<Button color="error" onClick={handleCancel}>
							Cancel
						</Button>
					</ButtonGroup>
				</Box>
				{errorText && (
					<Alert severity="error">
						<AlertTitle>Error</AlertTitle>
						{errorText}
					</Alert>
				)}
			</Box>
		</Modal>
	);
};

export default ListDeleteConfirmationModal;
