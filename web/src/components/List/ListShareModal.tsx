import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Dispatch, SetStateAction, useState } from 'react';
import { useGlobalContext } from '@/context/store';
import { toggleListSharee } from '@/utils/cinesync-api/fetch-list';

const ListShareModal = ({
	open,
	setShareModalOpen,
	handleClose,
	listId,
	name,
	getListShareesUsers,
}: {
	open: boolean;
	setShareModalOpen: Dispatch<SetStateAction<boolean>>;
	handleClose: () => void;
	listId: string;
	name: string;
	getListShareesUsers: () => Promise<void>;
}) => {
	const { token } = useGlobalContext();
	const [recipientEmail, setRecipientEmail] = useState('');
	const [isRecipientEmailInvalid, setIsRecipientEmailInvalid] = useState(false);
	const [errorText, setErrorText] = useState('');

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRecipientEmail(event.target.value);
	};

	const handleSubmit = async () => {
		if (!recipientEmail) {
			setIsRecipientEmailInvalid(true);
		} else {
			setIsRecipientEmailInvalid(false);
			const { success, fetchResponseJson } = await toggleListSharee({
				token: token,
				listId: listId,
				email: recipientEmail,
			});
			if (!success) {
				setErrorText(
					`Unable to share list: ${
						'message' in fetchResponseJson
							? fetchResponseJson.message
							: 'unknown'
					}`,
				);
			} else {
				setRecipientEmail('');
				setErrorText('');
				setShareModalOpen(false);
				getListShareesUsers();
			}
		}
	};

	const handleCancel = () => {
		setIsRecipientEmailInvalid(false);
		setErrorText('');
		setRecipientEmail('');
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
						Share List: {name}
					</Typography>
					<Divider />
					<Typography variant="body1" gutterBottom sx={{ margin: 5 }}>
						Please enter the email recipient.
					</Typography>
					<TextField
						style={{ marginTop: 20, marginBottom: 20 }}
						id="recipient-email-entry"
						label="Recipient Email"
						variant="outlined"
						value={recipientEmail}
						autoFocus
						onChange={handleTextChange}
						onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : null)}
						error={isRecipientEmailInvalid}
						helperText={
							isRecipientEmailInvalid && 'Recipient email must be populated.'
						}
					/>
					<Box display="flex" justifyContent="center" alignItems="center">
						<ButtonGroup variant="contained">
							<Button onClick={handleSubmit}>Share/Unshare</Button>
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

export default ListShareModal;
