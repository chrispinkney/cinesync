import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import CardActions from '@mui/material/CardActions';
import ListActions from '../ListActions';
import { useLists } from '@/context/lists.context';
import ListCreator from './ListCreator';
import Grid from '@mui/material/Unstable_Grid2';

const ListCard = ({ id, name, isPrivate, movie, creatorId }: MovieListLite) => {
	const { refreshListsContext } = useLists();
	const movieCount = movie.length;
	const firstFiveMovies: MovieItem[] = movie.slice(0, 5);
	const remainingMovies: number = Math.max(movieCount - 5, 0);

	return (
		<Grow in={true}>
			<Card>
				<CardActionArea component={Link} href={`/dashboard/list/${id}`}>
					<CardContent sx={{ height: 420 }}>
						<Grid container>
							<Grid
								sx={{
									display: { xs: 'none', sm: 'flex' },
									justifyContent: 'center',
									alignItems: 'center',
									paddingLeft: 1,
								}}
								xs={1}
							>
								<ListCreator id={creatorId} />
							</Grid>
							<Grid
								sx={{
									display: 'flex',
									justifyContent: 'left',
									alignItems: 'center',
								}}
								xs={12}
								sm={11}
							>
								<Typography variant="h5" align="center" paddingLeft={2}>
									{name}
								</Typography>
							</Grid>
						</Grid>
						<Typography variant="caption">{`${movieCount} movie${
							movieCount == 1 ? '' : 's'
						}`}</Typography>
						<List>
							{firstFiveMovies.map(({ title, releaseDate }: MovieItem) => (
								<ListItem dense={true} key={title}>
									<ListItemText
										primary={title}
										secondary={releaseDate.slice(0, 4)}
									/>
								</ListItem>
							))}
							{!!remainingMovies && (
								<ListItem dense={true}>
									<ListItemText
										primary={`${remainingMovies} more...`}
										sx={{ fontStyle: 'italic' }}
									/>
								</ListItem>
							)}
						</List>
					</CardContent>
				</CardActionArea>
				<CardActions disableSpacing>
					<ListActions
						listId={id}
						refreshContext={refreshListsContext}
						name={name}
						isPrivate={isPrivate}
					/>
				</CardActions>
			</Card>
		</Grow>
	);
};

export default ListCard;
