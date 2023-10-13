import { GridToolbarContainer } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

type EditToolbarProps = {
	addMovie: () => void;
	saveList: () => void;
};

const MovieListTableEditToolbar = (props: EditToolbarProps) => {
	const { addMovie, saveList } = props;

	const handleAddClick = () => {
		addMovie();
	};

	const handleSaveClick = () => {
		saveList();
	};

	return (
		<GridToolbarContainer sx={{ p: 1 }}>
			<Tooltip title="Add movie">
				<IconButton onClick={handleAddClick}>
					<AddIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="Save list">
				<IconButton
					aria-label="save list"
					onClick={handleSaveClick}
					sx={{ ml: 'auto' }}
				>
					<SaveIcon />
				</IconButton>
			</Tooltip>
		</GridToolbarContainer>
	);
};

export default MovieListTableEditToolbar;
