'use client';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useState, useEffect } from 'react';

type ListShareeAvatarsProps = {
	token: string;
	sharees: ShareeUserReturnDto[];
};

const ListShareeAvatars = ({ token, sharees }: ListShareeAvatarsProps) => {
	const [shareeAvatars, setShareeAvatars] = useState<string[]>([]);

	const getAvatars = async () => {
		const headers = { Authorization: `${token}` };
		try {
			const avatars = await Promise.all(
				sharees.slice(0, 2).map(async (sharee) => {
					const response = await fetch(
						`${process.env.NEXT_PUBLIC_URL}/auth/avatar?username=${
							(sharee as ShareeUser).username
						}` ||
							`http://localhost:3000/auth/avatar?username=${
								(sharee as ShareeUser).username
							}`,
						{
							method: 'GET',
							headers: { ...headers },
						},
					);

					if (response.ok) {
						const buffer = await response.arrayBuffer();
						const blob = new Blob([buffer], {
							type: `${response.headers.get('content-type')}`,
						});
						return URL.createObjectURL(blob);
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
