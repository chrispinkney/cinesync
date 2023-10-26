'use client';
import { useMovieList } from '@/context/movielist.context';
import { useGlobalContext } from '@/context/store';
import { deleteListMovie } from '@/utils/cinesync-api/fetch-list';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';

const MovieActions = ({ movie }: { movie: MovieItem }) => {
	const { id: movieId, imdbId, isNew } = movie;
	const { token } = useGlobalContext();
	const { movieList, setMovieList, refreshMovieListContext, setListEdited } =
		useMovieList();

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
						sx={{
							'&:hover': {
								backgroundColor: 'info.main',
								color: 'info.contrastText',
							},
						}}
						aria-label="imdb link"
						rel="noopener noreferrer"
						href={`https://www.imdb.com/title/${imdbId}`}
						target="_blank"
						disabled={noImdbLink}
					>
						<SvgIcon>
							<svg
								width="800px"
								height="800px"
								viewBox="0 0 26 26"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
							>
								<path d="M14.31 9.588v.005c-.077-.048-.227-.07-.42-.07v4.815c.27 0 .44-.06.5-.165.062-.104.095-.405.095-.885v-2.866c0-.33-.004-.54-.033-.63-.022-.096-.067-.163-.14-.204zM22.416 0H1.62C.742.06.06.744 0 1.596V22.38c.06.874.712 1.542 1.555 1.617.015.003.03.003.045.003h20.845c.88-.088 1.55-.826 1.555-1.71V1.71C24 .82 23.305.07 22.416 0zM4.792 15.626H2.887V8.26h1.905v7.366zm6.54-.002H9.67v-4.97L9 15.623H7.812l-.698-4.86-.007 4.86H5.44V8.26h2.468c.083.523.16 1.048.23 1.574l.27 1.87.442-3.444h2.483v7.364zm4.977-2.18c0 .655-.044 1.094-.104 1.32-.062.22-.17.4-.326.52-.15.13-.34.218-.57.266-.223.045-.57.075-1.02.075l-.004-.002H11.98V8.26h1.426c.914 0 1.45.047 1.77.128.325.09.575.225.745.42.165.18.273.404.313.645.05.235.076.705.076 1.402v2.588zm4.944.475c0 .45-.045.764-.09.99-.06.224-.195.404-.405.568-.226.166-.48.24-.78.24-.22 0-.5-.06-.68-.136-.19-.094-.358-.237-.515-.427l-.116.47h-1.717V8.26l-.02-.003h1.8v2.4c.15-.175.315-.31.51-.4.196-.083.466-.127.69-.127.226-.003.45.036.66.115.17.07.32.185.436.33.09.125.15.27.18.42.03.138.044.43.044.87v2.054zM19.08 11.205c-.12 0-.194.04-.225.12-.03.08-.06.29-.06.624v1.946c0 .324.03.533.06.623.04.086.13.14.226.134.12 0 .272-.047.3-.14.03-.097.046-.32.046-.674l.03-.002v-1.89c0-.303-.015-.508-.06-.603-.044-.1-.195-.14-.315-.14z" />
							</svg>
						</SvgIcon>
					</IconButton>
				</span>
			</Tooltip>
			<Tooltip title="Delete movie">
				<IconButton
					sx={{
						marginLeft: 'auto',
						'&:hover': {
							backgroundColor: 'error.main',
							color: 'error.contrastText',
						},
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
