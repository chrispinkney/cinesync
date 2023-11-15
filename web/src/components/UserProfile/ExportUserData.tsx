'use client';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import IosShareIcon from '@mui/icons-material/IosShare';
import Grid from '@mui/material/Unstable_Grid2';
import { useGlobalContext } from '@/context/store';
import { getUserExport } from '@/utils/cinesync-api/fetch-user';

const ExportUserData = () => {
	const { token } = useGlobalContext();
	const getUserData = async () => {
		const { success, fetchResponseJson } = await getUserExport({
			token: token,
		});
		if (success && 'username' in fetchResponseJson) {
			const userData = JSON.stringify(fetchResponseJson, null, 2);
			const blob = new Blob([userData], { type: 'application/json' });
			const downloadLink = document.createElement('a');
			downloadLink.href = URL.createObjectURL(blob);
			downloadLink.download = `${fetchResponseJson.username}-Data.json`;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}
	};
	return (
		<Grid xs={3} display="flex" justifyContent="left" alignItems="center">
			<Tooltip title="Export Data">
				<Fab
					size="medium"
					aria-label="Export user data"
					onClick={getUserData}
					sx={{ bgcolor: 'primary.main' }}
				>
					<IosShareIcon />
				</Fab>
			</Tooltip>
		</Grid>
	);
};

export default ExportUserData;
