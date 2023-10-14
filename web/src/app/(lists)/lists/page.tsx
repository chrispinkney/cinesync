'use client';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ListCard from '@/components/List/ListCard/ListCard';
import ListCreationButton from '@/components/List/ListCreation/ListCreationButton';
import { useEffect, useState } from 'react';

const Page = () => {
	const [list, setList] = useState<MovieList[] | null>(null);

	useEffect(() => {
		(async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/lists`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			const fetchedList = (await response.json()).List;
			setList(fetchedList);
		})();
	}, []);

	return (
		<main>
			<Grid container spacing={4}>
				{list &&
					list?.map(({ id, name, Movie }) => (
						<Grid xs={6} lg={4} xl={3} key={id}>
							<ListCard id={id} name={name} Movie={Movie} />
						</Grid>
					))}
			</Grid>
			<ListCreationButton />
		</main>
	);
};

export default Page;
