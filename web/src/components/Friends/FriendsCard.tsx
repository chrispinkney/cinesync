'use client';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import FriendAction from './FriendAction';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { getAvatarByUsername } from '@/utils/cinesync-api/fetch-user';

type FriendsCardProps = {
	username: string;
	status: string;
	token: string;
	getFriends: () => void;
};
const FriendsCard = ({
	username,
	status,
	token,
	getFriends,
}: FriendsCardProps) => {
	const theme = useTheme();
	const [avatar, setAvatar] = useState<string>('');

	const getAvatar = async () => {
		const { success, fetchResponseJson } = await getAvatarByUsername({
			token: token,
			username: username,
		});
		if (success && 'imageUrl' in fetchResponseJson) {
			setAvatar(fetchResponseJson.imageUrl);
		} else {
			setAvatar('');
		}
	};

	useEffect(() => {
		getAvatar();
	}, []);

	return (
		<>
			<Grid
				container
				xs={12}
				sm={12}
				md={12}
				lg={12}
				xl={12}
				sx={{ borderBottom: 1, paddingBottom: 1, paddingTop: 1 }}
			>
				{status === 'PENDING' && (
					<Grid
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						xs={12}
						lg={1}
					>
						<Chip color="warning" label="Pending" size="small" />
					</Grid>
				)}
				<Grid
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					xs={12}
					lg={status === 'PENDING' ? 2 : 4}
					xl={status === 'PENDING' ? 2 : 4}
				>
					{avatar == '' ? (
						<Avatar
							sx={{
								bgcolor: theme.palette.primary.main,
								color: theme.palette.primary.contrastText,
								width: 56,
								height: 56,
							}}
							alt={username}
						>
							{username[0].toUpperCase()}
						</Avatar>
					) : (
						<Avatar
							sx={{
								width: 56,
								height: 56,
							}}
							alt="PlaceHolder Avatar"
							src={avatar}
						/>
					)}
				</Grid>
				<Grid
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					xs={12}
					lg={status === 'PENDING' ? 6 : 4}
					xl={status === 'PENDING' ? 6 : 4}
				>
					<Typography
						display="-webkit-box"
						fontSize={{ xs: 16, md: 20 }}
						overflow="hidden"
						textOverflow="ellipsis"
						sx={{
							WebkitLineClamp: '1',
							WebkitBoxOrient: 'vertical',
						}}
					>
						{username}
					</Typography>
				</Grid>
				<Grid
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					xs={12}
					lg={status === 'PENDING' ? 2 : 4}
					xl={status === 'PENDING' ? 2 : 4}
				>
					<FriendAction
						status={status}
						getFriends={getFriends}
						token={token}
						username={username}
					/>
				</Grid>
			</Grid>
		</>
	);
};

export default FriendsCard;
