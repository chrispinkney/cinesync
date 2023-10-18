'use client';
import { ReactNode, Suspense, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import Loading from '@/app/loading';
import { useGlobalContext } from '@/context/store';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
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
		const whoamiJSON = await whoami.json();

		if (whoamiJSON.statusCode == 401) {
			setAuthenticated(false);
			router.push('/');
			return;
		}
		setAuthenticated(true);
	};

	useEffect(() => {
		authenticationCall();
	}, []);

	if (!authenticated) {
		return <Loading />;
	}
	return (
		<>
			<Header />
			<Sidebar />

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					bgcolor: 'background.default',
					ml: '240px',
					mt: ['48px', '56px', '64px'],
					p: 3,
				}}
			>
				<Suspense fallback={<Loading />}>{children}</Suspense>
			</Box>
		</>
	);
};

export default DashboardLayout;
