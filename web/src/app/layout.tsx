import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import ThemeRegistry from '../../theme/ThemeRegistry';
import Box from '@mui/material/Box';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import Loading from '@/app/loading';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en">
			<ThemeRegistry>
				<body>
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
					<Footer />
				</body>
			</ThemeRegistry>
		</html>
	);
};

export default RootLayout;
