import { Fragment } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ListCard from '@/components/List/ListGrid/ListCard';
import ListCreationButton from '@/components/List/ListCreation/ListCreationButton';
import { useLists } from '@/context/lists.context';

const ListGrid = () => {
	const { lists } = useLists();

	return (
		<Fragment>
			<Grid container spacing={4}>
				{lists &&
					lists.map(({ id, name, isPrivate, movie }) => (
						<Grid xs={6} lg={4} xl={3} key={id}>
							<ListCard
								id={id}
								name={name}
								isPrivate={isPrivate}
								movie={movie}
							/>
						</Grid>
					))}
			</Grid>
			<ListCreationButton />
		</Fragment>
	);
};

export default ListGrid;
