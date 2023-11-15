'use client';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useState, useEffect } from 'react';
import { getAvatarByUsername } from '@/utils/cinesync-api/fetch-user';

type ListShareeAvatarsProps = {
	token: string;
	sharees: ShareeUserReturnDto[];
};

const ListShareeAvatars = ({ token, sharees }: ListShareeAvatarsProps) => {
	const [shareeAvatars, setShareeAvatars] = useState<string[]>([]);

	const getAvatars = async () => {
		try {
			const avatars = await Promise.all(
				sharees.slice(0, 2).map(async (sharee) => {
					const { success, fetchResponseJson } = await getAvatarByUsername({
						token: token,
						username: (sharee as ShareeUser).username,
					});
					if (success && 'imageUrl' in fetchResponseJson) {
						return fetchResponseJson.imageUrl;
					} else {
						return '';
					}
				}),
			);

			setShareeAvatars(avatars);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getAvatars();
	}, [sharees]);

	useEffect(() => {
		// this is empty so shareeAvatars causes a re-render every time it changes
	}, [shareeAvatars]);

	return (
		<AvatarGroup
			total={sharees.filter((sharee) => !(sharee as ShareeUser).creator).length}
			sx={{
				display: { xs: 'none', sm: 'flex' },
				'& .MuiAvatar-root': { width: 32, height: 32 },
			}}
		>
			{sharees.slice(0, 2).map((sharee, index) => {
				if (shareeAvatars[index] !== '' && !(sharee as ShareeUser).creator) {
					return (
						<Avatar
							key={`${sharee}+${index}`}
							alt={(sharee as ShareeUser).username.toUpperCase()}
							src={shareeAvatars[index] || undefined}
						/>
					);
				} else {
					if (!(sharee as ShareeUser).creator) {
						return (
							<Avatar key={`${sharee}+${index}`}>
								{(sharee as ShareeUser).username[0].toUpperCase()}
							</Avatar>
						);
					}
				}
			})}
		</AvatarGroup>
	);
};

export default ListShareeAvatars;
