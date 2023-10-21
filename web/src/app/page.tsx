'use client';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import AuthMain from '../components/Login/AuthMain';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/store';
import { getWhoAmI } from '@/utils/cinesync-api/fetch-user';

const Home = () => {
	const router = useRouter();
	const { token } = useGlobalContext();
	const [authenticated, setAuthenticated] = useState(false);

	const authenticationCall = async () => {
		const { success } = await getWhoAmI({ token });
		if (success) {
			setAuthenticated(true);
			router.push('/dashboard');
			return;
		}
		setAuthenticated(false);
	};

	useEffect(() => {
		authenticationCall();
	}, [router, token]);

	if (authenticated) {
		return <p>...loading</p>;
	}

	return (
		<main>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100%',
					width: '100%',
				}}
			>
				<AuthMain authentication={false} />
			</Box>
		</main>
	);
};

export default Home;
