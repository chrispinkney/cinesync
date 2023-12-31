'use client';
import { NextPage } from 'next';
import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';

// typing to pass props to layout.tsx on root, potentially don't need it for auth.
interface AuthMainProps {
	authentication: boolean;
}

// custom tab props for the "Login, signup" tabs
interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

// switch between tabs with different content
function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<div>{children}</div>
				</Box>
			)}
		</div>
	);
}

//
function tabProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const AuthMain: NextPage<AuthMainProps> = ({ authentication }) => {
	const [tabValue, settabValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		settabValue(newValue);
	};

	return (
		<div>
			<Box
				component="div"
				sx={{
					backgroundImage: { xs: '', md: "url('./login-bgd.jpeg')" },
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					minHeight: '100vh',
					minWidth: '100vw',
					flexGrow: 1,
				}}
			>
				<Card
					sx={{
						minWidth: 300,
						width: { xs: '80%', md: '475px' },
						position: 'absolute',
						left: '10%',
						top: '20%',
						opacity: '0.8',
					}}
				>
					<Box sx={{ width: '100%' }}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs
								value={tabValue}
								onChange={handleChange}
								aria-label="basic tabs example"
								centered
							>
								<Tab label="Login" {...tabProps(0)} sx={{ fontSize: 18 }} />
								<Tab
									label="Signup"
									{...tabProps(1)}
									sx={{ fontSize: 18, ml: 10 }}
								/>
							</Tabs>
						</Box>
						<CustomTabPanel value={tabValue} index={0}>
							<LoginCard />
						</CustomTabPanel>
						<CustomTabPanel value={tabValue} index={1}>
							<SignupCard settabValue={settabValue} />
						</CustomTabPanel>
					</Box>
				</Card>
			</Box>
		</div>
	);
};

export default AuthMain;
