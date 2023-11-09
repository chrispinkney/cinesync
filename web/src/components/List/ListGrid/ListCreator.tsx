'use client';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/store';
import { getUserById } from '@/utils/cinesync-api/fetch-user';
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
		const headers = { Authorization: `${token}` };
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}/auth/avatar?username=${creator}` ||
					`http://localhost:3000/auth/avatar?username=${creator}`,
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
				setAvatar(URL.createObjectURL(blob));
			} else {
				setAvatar('');
			}
		} catch (error: any) {
			console.log(error);
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
