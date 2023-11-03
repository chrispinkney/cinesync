'use client';
import { useMovieList } from '@/context/movielist.context';
import { useGlobalContext } from '@/context/store';
import { deleteListMovie } from '@/utils/cinesync-api/fetch-list';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';

const MovieActions = ({ movie }: { movie: MovieItem }) => {
	const { id: movieId, imdbId, isNew } = movie;
	const { token } = useGlobalContext();
	const { movieList, setMovieList, refreshMovieListContext, setListEdited } =
		useMovieList();
	const theme = useTheme();

	const handleDeleteMovie = async (movieId: string) => {
		if (isNew) {
			setMovieList((oldMovieList) => {
				return oldMovieList
					? {
							...oldMovieList,
							movie: oldMovieList.movie.filter((m) => m.id != movieId),
					  }
					: null;
			});
			setListEdited(true);
		} else {
			const { success } = await deleteListMovie({
				token,
				listId: movieList.id,
				movieId,
			});
			if (success) refreshMovieListContext();
		}
	};

	const noImdbLink = imdbId.length == 0;

	return (
		<>
			<Tooltip
				title={
					noImdbLink
						? 'No IMDB link available for this movie'
						: 'View movie on IMDB'
				}
			>
				<span>
					<IconButton
						aria-label="imdb link"
						rel="noopener noreferrer"
						href={`https://www.imdb.com/title/${imdbId}`}
						target="_blank"
						disabled={noImdbLink}
					>
						<Image
							src={noImdbLink ? '/imdb-logo-disabled.svg' : '/imdb-logo.svg'}
							height={24}
							width={24}
							alt="Imdb Link"
							priority={true}
						/>
					</IconButton>
				</span>
			</Tooltip>
			<Tooltip title="Delete movie">
				<IconButton
					sx={{
						marginLeft: 'auto',
						'&:hover': { backgroundColor: theme.palette.error.main },
					}}
					aria-label="delete movie"
					onClick={() => handleDeleteMovie(movieId)}
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		</>
	);
};

export default MovieActions;
