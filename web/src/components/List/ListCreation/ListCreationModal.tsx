'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useRouter } from 'next/navigation';

const ListCreationModal = ({
	open,
	handleClose,
}: {
	open: boolean;
	handleClose: () => void;
}) => {
	const { push } = useRouter();

	const [listName, setListName] = useState('');
	const [isListNameInvalid, setIsListNameInvalid] = useState(false);
	const [errorText, setErrorText] = useState('');

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setListName(event.target.value);
	};

	const handleSubmit = async () => {
		if (!listName) {
			setIsListNameInvalid(true);
		} else {
			setIsListNameInvalid(false);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}/lists/create`,
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					mode: 'cors',
					credentials: 'include',
					body: JSON.stringify({
						name: listName,
					}),
				},
			);
			if (!response.ok) {
				setErrorText(
					`Unable to create list: ${response.status} - ${response.statusText}`,
				);
			} else {
				setListName('');
				setErrorText('');
				handleClose();
				// New list not returned - will be corrected in future
				// let newListId: number = (await response.json()).List[0].id;
				// push(`/lists/${newListId}`);
				alert('Cannot redirect without new list id, refresh manually');
			}
		}
	};

	const handleCancel = () => {
		setIsListNameInvalid(false);
		setErrorText('');
		setListName('');
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
				<Stack spacing={2}>
					<Typography variant="h5" gutterBottom align="center">
						New List
					</Typography>
					<Divider />
					<Typography variant="body1" gutterBottom sx={{ margin: 5 }}>
						Please enter a name for your new list.
					</Typography>
					<TextField
						style={{ marginTop: 20, marginBottom: 20 }}
						id="list-name-entry"
						label="List Name"
						variant="outlined"
						value={listName}
						onChange={handleTextChange}
						onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : null)}
						error={isListNameInvalid}
						helperText={isListNameInvalid && 'List name must be populated.'}
					/>
					<Box display="flex" justifyContent="center" alignItems="center">
						<ButtonGroup variant="contained">
							<Button onClick={handleSubmit}>Create</Button>
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
				</Stack>
			</Box>
		</Modal>
	);
};

export default ListCreationModal;
