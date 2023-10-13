import ListActions from '@/components/List/ListActions';
import MovieListTable from '@/components/List/MovieListTable/MovieListTable';
import { tempList } from '@/tempData';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

const Page = async ({ params }: { params: { slug: string } }) => {
	const movieListId: number = parseInt(params.slug);
	const movieList: MovieList = tempList[movieListId];

	return (
		<main>
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
					<ListActions listId={movieList.id} />
				</Box>
			</Grid>
			<MovieListTable
				id={movieList.id}
				name={movieList.name}
				movies={movieList.movies}
			/>
		</main>
	);
};

export default Page;
