'use client';
import MovieListTableContainer from '@/components/List/MovieListTable/MovieListTableContainer';
import { MovieListContextProvider } from '@/context/movielist.context';

const Page = ({ params }: { params: { slug: string } }) => {
	const movieListId: number = parseInt(params.slug);

	return (
		<main>
			<MovieListContextProvider listId={movieListId}>
				<MovieListTableContainer />
			</MovieListContextProvider>
		</main>
	);
};

export default Page;
