import { useContext } from 'react';
import { ColorModeContext } from '../../../theme/ThemeRegistry';
import useTheme from '@mui/material/styles/useTheme';
import styled from '@mui/material/styles/styled';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Box from '@mui/material/Box';

const ColorModeSwitch = () => {
	const theme = useTheme();
	const colorMode = useContext(ColorModeContext);

	const StyledColorModeSwitch = styled((props: SwitchProps) => (
		<Switch
			focusVisibleClassName=".Mui-focusVisible"
			disableRipple
			{...props}
		/>
	))(({ theme }) => ({
		height: 50,
		width: 80,
		padding: 8,
		'& .MuiSwitch-track': {
			borderRadius: 36 / 2,
			opacity: 1,
			backgroundColor: theme.palette.background.default,
			'&:before, &:after': {
				content: '""',
				position: 'absolute',
				top: '50%',
				transform: 'translateY(-50%)',
				width: 20,
				height: 20,
			},
			'&:after': {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="white" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" /></svg>')`,
				left: 14,
			},
			'&:before': {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="black" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>')`,
				right: 14,
			},
		},
		'& .MuiSwitch-thumb': {
			color:
				theme.palette.mode === 'dark'
					? theme.palette.background.paper
					: theme.palette.primary.main,
			boxShadow: 'none',
			width: 28,
			height: 28,
			margin: 2,
		},
		'& .MuiSwitch-switchBase': {
			'&.Mui-checked': {
				transform: 'translateX(30px)',
				'& + .MuiSwitch-track': {
					opacity: 1,
					backgroundColor: theme.palette.background.default,
				},
			},
		},
	}));

	return (
		<Box ml="auto">
			<StyledColorModeSwitch
				checked={theme.palette.mode == 'dark'}
				onChange={() => colorMode.toggleColorMode()}
			/>
		</Box>
	);
};

export default ColorModeSwitch;
