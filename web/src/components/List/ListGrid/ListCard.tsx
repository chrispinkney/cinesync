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

const ListCard = ({ id, name, isPrivate, movie }: MovieListLite) => {
	const { refreshListsContext } = useLists();
	const movieCount = movie.length;
	const firstFiveMovies: MovieItem[] = movie.slice(0, 5);
	const remainingMovies: number = Math.max(movieCount - 5, 0);

	return (
		<Grow in={true}>
			<Card>
				<CardActionArea component={Link} href={`/dashboard/list/${id}`}>
					<CardContent sx={{ height: 420 }}>
						<Typography variant="h5" align="center">
							{name}
						</Typography>
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
