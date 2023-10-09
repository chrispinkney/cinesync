import { GridToolbarContainer } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import Fab from '@mui/material/Fab';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

type EditToolbarProps = {
	addMovie: () => void;
	saveList: () => void;
	loading: boolean;
	success: boolean;
};

const MovieListTableEditToolbar = ({
	addMovie,
	saveList,
	loading,
	success,
}: EditToolbarProps) => {
	const theme = useTheme();

	const handleAddClick = () => {
		addMovie();
	};

	const handleSaveClick = () => {
		saveList();
	};

	return (
		<GridToolbarContainer sx={{ p: 1 }}>
			<Tooltip title="Add movie">
				<Fab size="small" onClick={handleAddClick}>
					<AddIcon />
				</Fab>
			</Tooltip>
			<Tooltip title="Save list">
				<Box sx={{ ml: 'auto', position: 'relative' }}>
					{success ? (
						<Fab
							size="small"
							sx={{ ml: 'auto', bgcolor: theme.palette.success.main }}
						>
							<Check />
						</Fab>
					) : (
						<Fab
							size="small"
							aria-label="save list"
							onClick={handleSaveClick}
							disabled={loading}
						>
							<SaveIcon />
						</Fab>
					)}
					{loading && (
						<CircularProgress
							size={52}
							sx={{ position: 'absolute', top: -6, left: -6, zIndex: 1 }}
						/>
					)}
				</Box>
			</Tooltip>
		</GridToolbarContainer>
	);
};

export default MovieListTableEditToolbar;
