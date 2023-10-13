import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { tempList } from '@/tempData';
import ListCard from '@/components/List/ListCard/ListCard';
import ListCreationButton from '@/components/List/ListCreation/ListCreationButton';

const Page = async () => {
	// const res = await fetch('/');

	return (
		<main>
			<Grid container spacing={4}>
				{tempList.map(({ id, name, movies }) => (
					<Grid xs={6} lg={4} xl={3} key={name}>
						<ListCard id={id} name={name} movies={movies} />
					</Grid>
				))}
			</Grid>
			<ListCreationButton />
		</main>
	);
};

export default Page;
