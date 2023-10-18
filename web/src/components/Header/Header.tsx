import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Image from 'next/image';
import AvatarLogo from './AvatarLogo';

const Header = () => {
	return (
		<AppBar position="fixed" sx={{ zIndex: 2000 }}>
			<Toolbar sx={{ backgroundColor: 'background.paper' }}>
				<Box sx={{ flexGrow: 1 }}>
					<Link href="/">
						<Image
							src="/cinesync-logo-dark.svg"
							height={54}
							width={150}
							alt="CineSync Logo"
							style={{ margin: '1px' }}
							priority={true}
						/>
					</Link>
				</Box>
				<AvatarLogo />
			</Toolbar>
		</AppBar>
	);
};

export default Header;
