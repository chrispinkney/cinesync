'use client';
import { ReactNode, Suspense, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Header from '@/components/Header/Header';
import Loading from '@/app/loading';
import { useGlobalContext } from '@/context/store';
import { useRouter } from 'next/navigation';
import { UserProvider } from '@/context/user.context';

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
		<UserProvider>
			<Header />

			<Box
				component="main"
				sx={{
					bgcolor: 'background.default',
					mt: '64px',
					p: 3,
					height: 'calc(100vh - 64px)',
					overflow: 'auto',
				}}
			>
				<Suspense fallback={<Loading />}>{children}</Suspense>
			</Box>
		</UserProvider>
	);
};

export default DashboardLayout;
