import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import MovieAddModal from '../MovieSearch/MovieAddModal';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { useMovieList } from '@/context/movielist.context';

const MovieListGridHeader = ({
	loading,
	movielistUpdateSuccess,
	addMovie,
	saveMovieList,
}: {
	loading: boolean;
	movielistUpdateSuccess: boolean;
	addMovie: (movie: TmdbMovie) => void;
	saveMovieList: () => void;
}) => {
	const { listEdited } = useMovieList();
	const [addModalOpen, setAddModalOpen] = useState(false);

	const closeAddModal = () => {
		setAddModalOpen(false);
	};

	const handleAddClick = () => {
		setAddModalOpen(true);
	};

	return (
		<Box component={Paper} p={2} my={2} display="flex" flexDirection="row">
			<Box sx={{ mr: 'auto', position: 'relative' }}>
				<Tooltip title="Add movie">
					<Fab size="small" onClick={handleAddClick} color="primary">
						<AddIcon />
					</Fab>
				</Tooltip>
			</Box>
			{listEdited && !loading && !movielistUpdateSuccess && (
				<Typography
					ml="auto"
					mr={3}
					position="relative"
					alignSelf="center"
					variant="body2"
					color="text.secondary"
				>
					Unsaved Changes Pending...
				</Typography>
			)}
			<Tooltip title="Save list" disableHoverListener={!listEdited}>
				<Box sx={{ position: 'relative' }}>
					{movielistUpdateSuccess ? (
						<Fab size="small" sx={{ bgcolor: 'success.main' }}>
							<Check />
						</Fab>
					) : (
						<Fab
							size="small"
							aria-label="save list"
							color="primary"
							onClick={saveMovieList}
							disabled={loading || !listEdited}
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
			<MovieAddModal
				open={addModalOpen}
				closeModal={closeAddModal}
				addMovie={addMovie}
			/>
		</Box>
	);
};

export default MovieListGridHeader;
