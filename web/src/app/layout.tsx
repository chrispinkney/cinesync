import { ReactNode } from 'react';
import ThemeRegistry from '../../theme/ThemeRegistry';
import { GlobalContextProvider } from '@/context/store';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: {
		template: '%s | Cinesync',
		default: 'Cinesync - Synchronized Film Watchlists',
	},
	description: 'Create and share movie lists with friends.',
	openGraph: {
		title: {
			template: '%s | Cinesync',
			default: 'Cinesync - Synchronized Film Watchlists',
		},
		description: 'Create and share movie lists with friends.',
		url: 'https://cinemasync.me/',
		type: 'website',
		images: [
			{
				url: '/cinesync-icon.png',
				width: 160,
				height: 168,
				alt: 'Cinesync logo',
			},
		],
	},
};

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
