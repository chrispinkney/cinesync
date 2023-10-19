import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';

const MovieCard = ({
	tmdbMovie,
	handleAddMovie,
}: {
	tmdbMovie: TmdbMovieLite;
	handleAddMovie: (movieId: number) => void;
}) => {
	const handleClickMovie = () => {
		handleAddMovie(tmdbMovie.id);
	};

	return (
		<Tooltip
			placement="left"
			title={
				<>
					<Typography variant="h5">{tmdbMovie.title}</Typography>
					<Typography>{tmdbMovie.overview}</Typography>
				</>
			}
		>
			<Grid container direction="row" spacing="20px" height={87}>
				<Grid>
					<Box width={46} height={69} bgcolor="grey">
						{tmdbMovie.poster_path && (
							// This needs to be an <img/> component as we do not know the source at compile time
							// Next complains about <img/>, so the linter needs to be disabled to avoid these warnings
							// eslint-disable-next-line @next/next/no-img-element
							<img
								height={69}
								width={46}
								src={`https://image.tmdb.org/t/p/w92${tmdbMovie.poster_path}`}
								alt=""
							/>
						)}
					</Box>
				</Grid>
				<Grid>
					<Stack spacing={1} width={300}>
						<Typography noWrap variant="h6">
							{tmdbMovie.title}
						</Typography>
						{tmdbMovie.release_date ? (
							<Typography>{`(${tmdbMovie.release_date.slice(
								0,
								4,
							)})`}</Typography>
						) : (
							<Typography>(unknown)</Typography>
						)}
					</Stack>
				</Grid>
				<Box
					width={50}
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Tooltip title="Add movie">
						<Fab size="small" onClick={handleClickMovie}>
							<AddIcon />
						</Fab>
					</Tooltip>
				</Box>
			</Grid>
		</Tooltip>
	);
};

export default MovieCard;
