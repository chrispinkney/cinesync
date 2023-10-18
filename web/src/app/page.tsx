'use client';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import AuthMain from '../components/Login/AuthMain';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/store';

const Home = () => {
	const router = useRouter();
	const { token } = useGlobalContext();
	const [authenticated, setAuthenticated] = useState(false);

	const authenticationCall = async () => {
		const headers = { Authorization: `${token}` };
		const whoami = await fetch(
			`${process.env.NEXT_PUBLIC_URL}/auth/whoami` ||
				'http://localhost:3000/auth/whoami',
			{
				method: 'get',
				headers: { ...headers },
			},
		);

		if (whoami.status != 401) {
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
