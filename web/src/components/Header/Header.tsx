'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Image from 'next/image';
import AvatarLogo from './AvatarLogo';
import { UserProvider } from '@/context/user.context';
import useTheme from '@mui/material/styles/useTheme';
import ColorModeSwitch from './ColorModeSwitch';

const Header = () => {
	const theme = useTheme();

	return (
		<AppBar position="fixed" sx={{ zIndex: 2000 }}>
			<Toolbar
				sx={{
					height: '64px',
					backgroundColor:
						theme.palette.mode == 'dark' ? 'background.paper' : '#2D3641',
				}}
			>
				<UserProvider>
					<Link href="/dashboard">
						<Box sx={{ '&:hover': { filter: 'drop-shadow(0 0 2px white)' } }}>
							<Image
								src="/cinesync-logo-dark.svg"
								height={54}
								width={150}
								alt="CineSync Logo"
								style={{ margin: '1px' }}
								priority={true}
							/>
						</Box>
					</Link>
					<ColorModeSwitch />
					<AvatarLogo />
				</UserProvider>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
