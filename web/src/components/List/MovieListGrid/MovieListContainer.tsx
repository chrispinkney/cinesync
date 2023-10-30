import { useMovieList } from '@/context/movielist.context';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Fragment, useState } from 'react';
import ListActions from '@/components/List/ListActions';
import MovieListGrid from './MovieListGrid';
import { updateList } from '@/utils/cinesync-api/fetch-list';
import { useGlobalContext } from '@/context/store';
import MovieListGridHeader from './MovieListGridHeader';
import MovieListTitle from './MovieListTitle';

const MovieListContainer = () => {
	const { token } = useGlobalContext();
	const { movieList, setMovieList, refreshMovieListContext, setListEdited } =
		useMovieList();
	// States for save list action
	const [loading, setLoading] = useState(false);
	const [movielistUpdateSuccess, setmovielistUpdateSuccess] = useState(false);

	const addMovie = (movie: TmdbMovie) => {
		setMovieList((oldMovieList: MovieList | null) => {
			if (!oldMovieList) {
				return null;
			}
			return {
				...oldMovieList,
				Movie: [
					{
						id: movie.id.toString(),
						title: movie.title,
						description: movie.overview,
						genre: movie.genres.map((genre) => genre.name),
						release_date: movie.release_date,
						poster_url: movie.poster_path ?? '',
						rating: movie.vote_average,
						imdb_id: movie.imdb_id ?? '',
						isNew: true,
					},
					...oldMovieList.Movie,
				],
			};
		});
		setListEdited(true);
	};

	const saveMovieList = async () => {
		setLoading(true);
		const { success } = await updateList({
			token,
			body: {
				listId: movieList.id,
				name: movieList.name,
				Movie: movieList.Movie,
			},
		});
		if (success) {
			setmovielistUpdateSuccess(true);
			setTimeout(() => {
				setListEdited(false);
				setmovielistUpdateSuccess(false);
				refreshMovieListContext();
			}, 1000);
		} else {
			setmovielistUpdateSuccess(false);
		}
		setLoading(false);
	};

	return (
		<Fragment>
			{movieList && (
				<Fragment>
					<Grid
						xs
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<MovieListTitle name={movieList.name} />
						<Box>
							<ListActions
								listId={movieList.id}
								refreshContext={refreshMovieListContext}
								name={movieList.name}
							/>
						</Box>
					</Grid>
					<MovieListGridHeader
						loading={loading}
						movielistUpdateSuccess={movielistUpdateSuccess}
						addMovie={addMovie}
						saveMovieList={saveMovieList}
					/>
					<MovieListGrid />
				</Fragment>
			)}
		</Fragment>
	);
};

export default MovieListContainer;