'use client';
import { ReactNode } from 'react';
import ThemeRegistry from '../../theme/ThemeRegistry';
import { GlobalContextProvider } from '@/context/store';

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en">
			<ThemeRegistry>
				<body>
					<GlobalContextProvider>{children}</GlobalContextProvider>
				</body>
			</ThemeRegistry>
		</html>
	);
};

export default RootLayout;
