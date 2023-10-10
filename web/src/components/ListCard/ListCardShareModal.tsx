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
import { useState } from 'react';

const ListCardShareModal = ({
	open,
	handleClose,
	listId,
}: {
	open: boolean;
	handleClose: () => void;
	listId: number;
}) => {
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
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}/lists/create?` +
					new URLSearchParams({
						email: recipientEmail,
					}),
				{
					method: 'POST',
				},
			);
			if (!response.ok || response.status >= 300) {
				setErrorText(
					`Unable to share list: ${response.status} - ${response.statusText}`,
				);
			} else {
				setRecipientEmail('');
				setErrorText('');
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
						Share List #{listId}
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
						onChange={handleTextChange}
						error={isRecipientEmailInvalid}
						helperText={
							isRecipientEmailInvalid && 'Recipient email must be populated.'
						}
					/>
					<Box display="flex" justifyContent="center" alignItems="center">
						<ButtonGroup variant="contained">
							<Button onClick={handleSubmit}>Share</Button>
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

export default ListCardShareModal;
