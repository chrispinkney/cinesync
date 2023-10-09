import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

const ListCard = ({ id, name, movies }: MovieList) => {
	const movieCount = movies.length;
	const firstFiveMovies: Movie[] = movies.slice(0, 5);
	const remainingMovies: number = Math.max(movieCount - 5, 0);

	return (
		<Grow in={true}>
			<Card>
				<CardActionArea component={Link} href={`/list/${id}`}>
					<CardContent sx={{ height: 420 }}>
						<Typography variant="h5">{name}</Typography>
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
				<CardActions disableSpacing>
					<IconButton aria-label="add to favorites">
						<FavoriteIcon />
					</IconButton>
					<IconButton aria-label="share">
						<ShareIcon />
					</IconButton>
					<IconButton sx={{ marginLeft: 'auto' }} aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				</CardActions>
			</Card>
		</Grow>
	);
};

export default ListCard;
