import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Lato } from 'next/font/google';

const darkMode = true;

const lato = Lato({
	weight: ['300', '400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
});

const themeOptions: ThemeOptions = {
	typography: {
		fontFamily: lato.style.fontFamily,
		fontSize: 14,
	},
	palette: darkMode
		? {
				mode: 'dark',
				text: { primary: '#dfecf1', secondary: '#a6b4ba' },
				background: { default: '#12181e', paper: '#171f26' },
				primary: { main: '#294F5B' },
				secondary: { main: '#95b5c9' },
				error: { main: '#c34927' },
				warning: { main: '#cdcd3c' },
				info: { main: '#37c3d4' },
				success: { main: '#62af3e' },
		  }
		: {
				mode: 'light',
				text: { primary: '#12181e', secondary: '#01241a' },
				background: { default: '#FCFDFD' },
				primary: { main: '#1f6145' },
				secondary: { main: '#71b3c8' },
				error: { main: '#c34927' },
				warning: { main: '#cdcd3c' },
				info: { main: '#37c3d4' },
				success: { main: '#62af3e' },
		  },
};

const theme = createTheme(themeOptions);

export default theme;
