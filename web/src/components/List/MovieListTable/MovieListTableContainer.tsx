import { useMovieList } from '@/context/movielist.context';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Fragment } from 'react';
import ListActions from '@/components/List/ListActions';
import MovieListTable from '@/components/List/MovieListTable/MovieListTable';

const MovieListTableContainer = () => {
	const { movieList, refreshMovieListContext } = useMovieList();

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
						<Typography variant="h3" gutterBottom>
							{movieList.name}
						</Typography>
						<Box>
							<ListActions
								listId={movieList.id}
								refreshContext={refreshMovieListContext}
							/>
						</Box>
					</Grid>
					<MovieListTable />
				</Fragment>
			)}
		</Fragment>
	);
};

export default MovieListTableContainer;
