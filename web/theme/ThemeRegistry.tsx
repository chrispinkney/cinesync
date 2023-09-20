'use client';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import NextAppDirEmotionCacheProvider, {
	NextAppDirEmotionCacheProviderProps,
} from './EmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

const ThemeRegistry = ({ children }: { children: ReactNode }) => {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</NextAppDirEmotionCacheProvider>
	);
};

export default ThemeRegistry;
