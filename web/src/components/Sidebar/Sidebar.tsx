import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InfoIcon from '@mui/icons-material/Info';

const TopNavigationLinks: NavigationLink[] = [
	{ text: 'Home', href: '/', icon: HomeIcon },
	{ text: 'My Lists', href: '/lists', icon: FormatListBulletedIcon },
];

const BottomNavigationLinks: NavigationLink[] = [
	{ text: 'About', href: '/about', icon: InfoIcon },
];

const Sidebar = () => {
	return (
		<Drawer
			sx={{
				width: 240,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: 240,
					boxSizing: 'border-box',
					top: ['48px', '56px', '64px'],
					height: 'auto',
					bottom: 0,
				},
			}}
			variant="permanent"
			anchor="left"
		>
			<Divider />
			<List>
				{TopNavigationLinks.map(({ text, href, icon: Icon }) => (
					<ListItem key={href} disablePadding>
						<ListItemButton component={Link} href={href}>
							<ListItemIcon>
								<Icon />
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider sx={{ mt: 'auto' }} />
			<List>
				{BottomNavigationLinks.map(({ text, href, icon: Icon }) => (
					<ListItem key={text} disablePadding>
						<ListItemButton component={Link} href={href}>
							<ListItemIcon>
								<Icon />
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Drawer>
	);
};

export default Sidebar;
