import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import ListCardActions from '@/components/ListCard/ListCardActions';

const ListCard = ({ id, name, movies }: MovieList) => {
	const movieCount = movies.length;
	const firstFiveMovies: Movie[] = movies.slice(0, 5);
	const remainingMovies: number = Math.max(movieCount - 5, 0);

	return (
		<Grow in={true}>
			<Card>
				<CardActionArea component={Link} href={`/list/${id}`}>
					<CardContent sx={{ height: 420 }}>
						<Typography variant="h5" align="center">
							{name}
						</Typography>
						<Typography variant="caption">{`${movieCount} movie${
							movieCount == 1 ? '' : 's'
						}`}</Typography>
						<List>
							{firstFiveMovies.map(({ title, year }) => (
								<ListItem dense={true} key={title}>
									<ListItemText primary={title} secondary={year} />
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
				<ListCardActions listId={id} />
			</Card>
		</Grow>
	);
};

export default ListCard;
