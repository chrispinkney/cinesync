'use client';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { updateFriendRequest } from '@/utils/cinesync-api/fetch-user';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';

type FriendActionProps = {
	status: string;
	token: string;
	username: string;
	getFriends: () => void;
};

const FriendAction = ({
	status,
	token,
	username,
	getFriends,
}: FriendActionProps) => {
	const theme = useTheme();

	const handleFriendAction = async () => {
		if (status === 'PENDING') {
			const { success } = await updateFriendRequest({
				token: token,
				body: {
					username: username,
					status: 'ACCEPT',
				},
			});
			if (success) {
				getFriends();
			}
		} else if (status === 'ACCEPT' || status == 'SENT') {
			const { success } = await updateFriendRequest({
				token: token,
				body: {
					username: username,
					status: 'REJECT',
				},
			});
			if (success) {
				getFriends();
			}
		}
	};

	const handleFriendReject = async () => {
		if (status === 'PENDING') {
			const { success } = await updateFriendRequest({
				token: token,
				body: {
					username: username,
					status: 'REJECT',
				},
			});
			if (success) {
				getFriends();
			}
		}
	};

	const renderButton = () => {
		let buttonInfo = {
			text: '',
			icon: <></>,
		};

		if (status === 'ACCEPT') {
			buttonInfo = { text: 'Remove', icon: <PersonRemoveIcon /> };
		} else if (status === 'SENT') {
			buttonInfo = { text: 'Cancel', icon: <PersonRemoveIcon /> };
		} else {
			buttonInfo = { text: 'Accept', icon: <PersonAddIcon /> };
		}
		return (
			<>
				{buttonInfo.text} {buttonInfo.icon}
			</>
		);
	};

	return (
		<>
			{status === 'PENDING' && (
				<Tooltip title="Remove friend">
					<Fab
						size="small"
						variant="extended"
						sx={{
							bgcolor: theme.palette.error.main,
						}}
						aria-label="removeFriend"
						onClick={handleFriendReject}
					>
						REJECT
						<PersonRemoveIcon />
					</Fab>
				</Tooltip>
			)}
			<Tooltip
				title={
					status === 'ACCEPT' || status === 'SENT'
						? 'Remove friend'
						: 'Add friend'
				}
			>
				<Fab
					size="small"
					variant="extended"
					sx={{
						bgcolor:
							status === 'ACCEPT' || status === 'SENT'
								? theme.palette.error.main
								: theme.palette.primary.main,
					}}
					aria-label="removeFriend"
					onClick={handleFriendAction}
				>
					{renderButton()}
				</Fab>
			</Tooltip>
		</>
	);
};

export default FriendAction;
