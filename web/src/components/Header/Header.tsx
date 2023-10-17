'use client';
import { MouseEvent, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';

interface IPlaceHolderUserInfo {
	username: string;
	initials: string;
}

const placeHolderUserInfo: IPlaceHolderUserInfo = {
	username: 'John Doe',
	initials: 'JD',
};

const HeaderNavigationLinks: NavigationLink[] = [
	{ text: 'Settings', href: '/settings', icon: SettingsIcon },
	{ text: 'Logout', href: '/signout', icon: LogoutIcon },
];

const Header = () => {
	const theme = useTheme();

	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

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
				<Box sx={{ flexGrow: 0 }}>
					<Tooltip title="Open settings">
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar
								sx={{
									bgcolor: theme.palette.primary.main,
									color: theme.palette.text.primary,
								}}
								alt={placeHolderUserInfo.username}
							>
								{placeHolderUserInfo.initials}
							</Avatar>
						</IconButton>
					</Tooltip>
					<Menu
						sx={{ mt: '45px' }}
						id="menu-appbar"
						anchorEl={anchorElUser}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={Boolean(anchorElUser)}
						onClose={handleCloseUserMenu}
					>
						{HeaderNavigationLinks.map(({ text, href, icon: Icon }) => (
							<MenuItem key={text} component={Link} href={href}>
								<ListItemIcon>
									<Icon />
								</ListItemIcon>
								<ListItemText primary={text} />
							</MenuItem>
						))}
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
