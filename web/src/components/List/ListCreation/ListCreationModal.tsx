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
import { useGlobalContext } from '@/context/store';
import { createList } from '@/utils/cinesync-api/fetch-list';

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
	const { token } = useGlobalContext();

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setListName(event.target.value);
	};

	const handleSubmit = async () => {
		if (!listName) {
			setIsListNameInvalid(true);
		} else {
			setIsListNameInvalid(false);
			const { success, fetchResponseJson } = await createList({
				token: token,
				body: { name: listName },
			});
			if (success && 'list' in fetchResponseJson) {
				let newListId: string = fetchResponseJson.list.id;
				setListName('');
				setErrorText('');
				handleClose();
				push(`/dashboard/list/${newListId}`);
			} else {
				setErrorText(
					`Unable to create list: ${
						'message' in fetchResponseJson
							? fetchResponseJson.message
							: 'unknown'
					}`,
				);
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
						autoFocus
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
