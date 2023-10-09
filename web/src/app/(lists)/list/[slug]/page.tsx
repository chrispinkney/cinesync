import MovieListTable from '@/components/MovieListTable/MovieListTable';
import { tempList } from '@/tempData';
import Typography from '@mui/material/Typography';

const Home = async ({ params }: { params: { slug: string } }) => {
	const movieListId: number = parseInt(params.slug);
	const movieList: MovieList = tempList[movieListId];

	return (
		<main>
			<Typography variant="h3">List Number: {movieListId}</Typography>
			<MovieListTable
				id={movieList.id}
				name={movieList.name}
				movies={movieList.movies}
			/>
		</main>
	);
};

export default Home;
