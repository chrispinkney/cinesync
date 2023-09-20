'use client';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const Home = () => {
	const theme = useTheme();

	// Temporary for color demonstration
	const themeColors = [
		{
			text: 'Primary',
			color: theme.palette.primary.main,
		},
		{
			text: 'Secondary',
			color: theme.palette.secondary.main,
		},
		{
			text: 'Error',
			color: theme.palette.error.main,
		},
		{
			text: 'Warning',
			color: theme.palette.warning.main,
		},
		{
			text: 'Info',
			color: theme.palette.info.main,
		},
		{
			text: 'Success',
			color: theme.palette.success.main,
		},
	];

	return (
		<main>
			<h1>About (WIP)</h1>
			{themeColors.map(({ text, color }) => {
				return (
					<Box
						key={text}
						sx={{
							width: 200,
							height: 200,
							backgroundColor: color,
						}}
					>
						{text}
					</Box>
				);
			})}
		</main>
	);
};

export default Home;
