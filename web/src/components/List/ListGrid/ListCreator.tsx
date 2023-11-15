'use client';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/store';
import {
	getAvatarByUsername,
	getUserById,
} from '@/utils/cinesync-api/fetch-user';
import Avatar from '@mui/material/Avatar';

type ListCreatorProps = {
	id: string;
};

const ListCreator = ({ id }: ListCreatorProps) => {
	const { token } = useGlobalContext();
	const [creator, setCreator] = useState<string>('');
	const [avatar, setAvatar] = useState<string>();

	const getCreatorUsername = async () => {
		const { success, fetchResponseJson } = await getUserById({
			token: token,
			userId: id,
		});
		if (success) {
			if ('username' in fetchResponseJson) {
				setCreator(fetchResponseJson.username);
			}
		}
	};

	const getAvatar = async () => {
		const { success, fetchResponseJson } = await getAvatarByUsername({
			token: token,
			username: creator,
		});
		if (success && 'imageUrl' in fetchResponseJson) {
			setAvatar(fetchResponseJson.imageUrl);
		} else {
			setAvatar('');
		}
	};

	useEffect(() => {
		getCreatorUsername();
	}, []);

	useEffect(() => {
		getAvatar();
	}, [creator]);

	return (
		<>
			{avatar && avatar !== '' ? (
				<Avatar key={id} alt={id} src={avatar} />
			) : (
				<Avatar key={id}>
					{creator && creator !== '' ? (
						(creator as string)[0].toUpperCase()
					) : (
						<></>
					)}
				</Avatar>
			)}
		</>
	);
};

export default ListCreator;
