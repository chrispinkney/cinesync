'use client';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useGlobalContext } from '@/context/store';
import { getUserFriends } from '@/utils/cinesync-api/fetch-user';
import FriendsCard from './FriendsCard';
import { Paper } from '@mui/material';
import FriendsAdd from './FriendsAdd';

const FriendsContainer = () => {
	const { token } = useGlobalContext();
	const [friends, setFriends] = useState<FriendsDto[]>([]);

	const getFriends = async () => {
		const { success, fetchResponseJson } = await getUserFriends({
			token: token,
		});
		if (success && Array.isArray(fetchResponseJson)) {
			setFriends(fetchResponseJson);
		}
	};

	useEffect(() => {
		getFriends();
	}, []);

	return (
		<>
			<Grid
				sx={{
					marginTop: '14vh',
					justifyContent: 'center',
					display: 'flex',
					marginBottom: 2,
				}}
			>
				<FriendsAdd getFriends={getFriends} />
			</Grid>
			<Grid
				sx={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Box
					sx={{
						maxWidth: '60vw',
						minWidth: '50vw',
						borderRadius: 1,
					}}
					component={Paper}
				>
					<Grid
						container
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{friends.length != 0 ? (
							<>
								{friends.map(({ username, status }: FriendsDto, index) => (
									<>
										<FriendsCard
											key={username + index}
											username={username}
											status={status}
											token={token}
											getFriends={getFriends}
										/>
									</>
								))}
							</>
						) : (
							<>You have no friends added</>
						)}
					</Grid>
				</Box>
			</Grid>
		</>
	);
};

export default FriendsContainer;
