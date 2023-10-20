'use client';
import { MouseEvent, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import { useGlobalContext } from '@/context/store';
import { getUserAvatar, getWhoAmI } from '@/utils/cinesync-api/fetch-user';
import { useUser } from '@/context/user.context';

interface IPlaceHolderUserInfo {
	username: string;
	initials: string;
}

const HeaderNavigationLinks: NavigationLink[] = [
	{ text: 'Settings', href: '/dashboard/userprofile', icon: SettingsIcon },
	{ text: 'Logout', href: '/signout', icon: LogoutIcon },
];

const AvatarLogo = () => {
	const userContext = useUser();
	const { avatar } = useUser();
	const { token } = useGlobalContext();
	const theme = useTheme();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const [userInfo, setUserInfo] = useState({ username: '', initials: '' });

	const getUser = async () => {
		const { fetchResponseJson } = await getWhoAmI({ token });
		const whoamiJSON = fetchResponseJson;
		if ('username' in whoamiJSON) {
			const placeHolderUserInfo: IPlaceHolderUserInfo = {
				username: whoamiJSON.username,
				initials: whoamiJSON.username[0].toUpperCase(),
			};
			setUserInfo(placeHolderUserInfo);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	return (
		<Box sx={{ flexGrow: 0 }}>
			<Tooltip title="Open settings">
				<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
					{avatar == '' ? (
						<Avatar
							sx={{
								bgcolor: theme.palette.primary.main,
								color: theme.palette.primary.contrastText,
							}}
							alt={userInfo.username}
						>
							{userInfo.initials}
						</Avatar>
					) : (
						<Avatar alt="PlaceHolder Avatar" src={avatar} />
					)}
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
	);
};

export default AvatarLogo;
