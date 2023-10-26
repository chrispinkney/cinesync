'use client';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, alpha, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
	weight: ['300', '400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
});

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const ThemeRegistry = ({ children }: { children: ReactNode }) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = useState<'light' | 'dark' | ''>('dark');

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => {
					let newMode: 'light' | 'dark' =
						prevMode === 'light' ? 'dark' : 'light';
					localStorage.setItem('themeMode', newMode);
					return newMode;
				});
			},
		}),
		[],
	);

	const theme = useMemo(
		() =>
			createTheme({
				typography: {
					fontFamily: poppins.style.fontFamily,
					fontSize: 12,
					body2: { fontWeight: 300 },
					h1: {
						fontWeight: 700,
					},
					h2: {
						fontWeight: 700,
					},
					h3: {
						fontWeight: 700,
					},
					h4: {
						fontWeight: 700,
					},
				},
				palette:
					mode == 'dark'
						? {
								mode: 'dark',
								text: { primary: '#dfeff1', secondary: '#a6b4ba' },
								background: { default: '#12181e', paper: '#171f26' },
								action: {
									hover: alpha('#56D79F', 0.6),
								},
								primary: { main: '#56D79F' },
								secondary: { main: '#68D1D7' },
								error: { main: '#db2a48' },
								warning: { main: '#edce42' },
								info: { main: '#7dd1db' },
								success: { main: '#22f573' },
						  }
						: {
								mode: 'light',
								text: { primary: '#121b1e', secondary: '#50595c' },
								background: { default: '#f7f9fa', paper: '#edeff2' },
								action: {
									active: alpha('#1e543d', 0.9),
									hover: alpha('#1e543d', 0.6),
								},
								primary: { main: '#1e543d' },
								secondary: { main: '#3e7687' },
								error: { main: '#db2a48' },
								warning: { main: '#edce42' },
								info: { main: '#7dd1db' },
								success: { main: '#22f573' },
						  },
				components: {
					MuiTooltip: {
						styleOverrides: {
							tooltip: {
								backgroundColor: alpha('#000', 0.7),
							},
						},
					},
					MuiCssBaseline: {
						styleOverrides: {
							body:
								mode == 'dark'
									? {
											scrollbarColor: '#3f464d #171f26',
											scrollbarWidth: 'auto',
											'&::-webkit-scrollbar, & *::-webkit-scrollbar': {
												backgroundColor: '#171f26',
											},
											'&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb':
												{
													borderRadius: 8,
													backgroundColor: '#3f464d',
													minHeight: 24,
													border: '3px solid ' + '#171f26',
												},
											'&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
												{
													backgroundColor: '#555e66',
												},
											'&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
												{
													backgroundColor: '#555e66',
												},
											'&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
												{
													backgroundColor: '#555e66',
												},
											'&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner':
												{
													backgroundColor: '#171f26',
												},
									  }
									: {
											scrollbarColor: '#ced2d9' + ' ' + '#edeff2',
											scrollbarWidth: 'auto',
											'&::-webkit-scrollbar, & *::-webkit-scrollbar': {
												backgroundColor: '#edeff2',
											},
											'&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb':
												{
													borderRadius: 8,
													backgroundColor: '#ced2d9',
													minHeight: 24,
													border: '3px solid ' + '#edeff2',
												},
											'&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
												{
													backgroundColor: '#b0b6bf',
												},
											'&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
												{
													backgroundColor: '#b0b6bf',
												},
											'&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
												{
													backgroundColor: '#b0b6bf',
												},
											'&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner':
												{
													backgroundColor: '#edeff2',
												},
									  },
						},
					},
				},
			}),
		[mode],
	);

	useEffect(() => {
		let storedMode = '';
		if (window?.localStorage) {
			storedMode = localStorage.getItem('themeMode') || '';
		}
		setMode(
			storedMode == 'dark' ? 'dark' : storedMode == 'light' ? 'light' : '',
		);
	}, []);

	useEffect(() => {
		if (mode == '') {
			setMode(prefersDarkMode ? 'dark' : 'light');
		}
	}, [mode, prefersDarkMode]);

	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{children}
				</ThemeProvider>
			</ColorModeContext.Provider>
		</NextAppDirEmotionCacheProvider>
	);
};

export default ThemeRegistry;
