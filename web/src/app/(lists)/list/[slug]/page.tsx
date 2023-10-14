'use client';
import ListActions from '@/components/List/ListActions';
import MovieListTable from '@/components/List/MovieListTable/MovieListTable';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Fragment, useEffect, useState } from 'react';

const Page = ({ params }: { params: { slug: string } }) => {
	const movieListId: number = parseInt(params.slug);

	const [movieList, setMovieList] = useState<MovieList | null>(null);

	useEffect(() => {
		(async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}/lists/${movieListId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				},
			);
			const fetchedMovieList = (await response.json()).List[0];
			setMovieList(fetchedMovieList);
		})();
	}, []);

	return (
		<main>
			{!!movieList && (
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
							<ListActions listId={movieList.id} />
						</Box>
					</Grid>
					<MovieListTable
						id={movieList.id}
						name={movieList.name}
						Movie={movieList.Movie}
					/>
				</Fragment>
			)}
		</main>
	);
};

export default Page;
