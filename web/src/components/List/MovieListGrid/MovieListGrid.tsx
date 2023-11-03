import { useMovieList } from '@/context/movielist.context';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import MovieListCard from '../MovieListCard/MovieListCard';
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';

const MovieListGrid = () => {
	const { movieList } = useMovieList();
	const [page, setPage] = useState<number>(1);
	const [visibleMovies, setVisibleMovies] = useState<MovieItem[]>(
		movieList.movie.slice(0, 12),
	);

	useEffect(() => {
		setVisibleMovies(movieList.movie.slice((page - 1) * 12, page * 12));
	}, [movieList, page]);

	return (
		<>
			<Grid container spacing={1}>
				{visibleMovies.map((movie) => (
					<MovieListCard key={movie.id} movie={movie} />
				))}
			</Grid>
			<Stack alignItems="center" mt={3}>
				<Pagination
					page={page}
					count={Math.ceil(movieList.movie.length / 12)}
					variant="outlined"
					color="primary"
					onChange={(_e, v) => setPage(v)}
				/>
			</Stack>
		</>
	);
};

export default MovieListGrid;
