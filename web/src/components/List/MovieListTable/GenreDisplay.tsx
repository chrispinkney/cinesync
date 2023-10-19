import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { GridRenderCellParams } from '@mui/x-data-grid';

const GenreDisplay = ({ params }: { params: GridRenderCellParams }) => {
	const { value } = params;
	const genres: string[] = value;

	return (
		<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
			{genres.map((value) => (
				<Chip key={value} label={value} />
			))}
		</Box>
	);
};

export default GenreDisplay;
