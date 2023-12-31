'use client';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Fragment, useMemo, useState } from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { fetchTmdbMovie, searchTmdbMovies } from '@/utils/tmdb-api/fetch';
import debounce from 'lodash.debounce';
import MovieCard from './MovieCard';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';

const MovieAddModal = ({
	open,
	closeModal,
	addMovie,
}: {
	open: boolean;
	closeModal: () => void;
	addMovie: (movie: TmdbMovie) => void;
}) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [searchResults, setSearchResults] = useState<
		TmdbMovieLite[] | undefined
	>(undefined);
	const [loadingResults, setLoadingResults] = useState<boolean>(false);

	const handleClose = () => {
		setSearchQuery('');
		setSearchResults(undefined);
		setLoadingResults(false);
		closeModal();
	};

	const handleSearchTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		let newSearchQuery = event.target.value;
		setSearchQuery(newSearchQuery);
		setLoadingResults(true);

		debouncedFetchTmdb(newSearchQuery);
	};

	const fetchTmdb = async (newSearchQuery: string) => {
		if (newSearchQuery.length == 0) {
			setSearchResults(undefined);
		} else {
			const fetchedSearchResults: TmdbMovieSearchResults =
				await searchTmdbMovies(newSearchQuery);
			const firstFiveMovies: TmdbMovieLite[] = fetchedSearchResults.results;
			setSearchResults(firstFiveMovies);
		}
		setLoadingResults(false);
	};

	const debouncedFetchTmdb = useMemo(() => debounce(fetchTmdb, 1000), []);

	const handleAddMovie = async (newMovieId: number) => {
		const newMovie: TmdbMovie = await fetchTmdbMovie(newMovieId);
		addMovie(newMovie);
		handleClose();
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				sx={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					display: 'flex',
					flexDirection: 'column',
					align: 'center',
					bgcolor: 'background.paper',
					boxShadow: 24,
					p: 4,
				}}
			>
				<Typography variant="body1" align="center" sx={{ mt: 1 }}>
					Search for a movie
				</Typography>
				<TextField
					sx={{ my: 2 }}
					id="movie-search-entry"
					label="Movie Name"
					variant="outlined"
					value={searchQuery}
					autoFocus
					onChange={handleSearchTextChange}
				/>
				<Collapse in={loadingResults || !!searchResults}>
					<Stack
						component={Paper}
						spacing={0.5}
						width={466}
						style={{ height: 476, overflow: 'auto' }}
					>
						{searchResults?.map((tmdbMovie: TmdbMovieLite, index: number) => (
							<Fragment key={tmdbMovie.id}>
								<MovieCard
									tmdbMovie={tmdbMovie}
									handleAddMovie={handleAddMovie}
								/>
								{index < searchResults.length - 1 && <Divider />}
							</Fragment>
						))}
						{loadingResults &&
							[...Array(5)].map((_val, i) => (
								<Fragment key={i}>
									<Skeleton variant="rectangular" height={92} />
									{i < 5 && <Divider />}
								</Fragment>
							))}
					</Stack>
				</Collapse>
			</Box>
		</Modal>
	);
};

export default MovieAddModal;
