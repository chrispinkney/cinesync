'use client';
import MovieListContainer from '@/components/List/MovieListGrid/MovieListContainer';
import { MovieListContextProvider } from '@/context/movielist.context';

const Page = ({ params }: { params: { slug: string } }) => {
	const movieListId: string = params.slug;

	return (
		<main>
			<MovieListContextProvider listId={movieListId}>
				<MovieListContainer />
			</MovieListContextProvider>
		</main>
	);
};

export default Page;
