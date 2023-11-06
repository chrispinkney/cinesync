import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import MovieListCommentEdit from './MovieListCommentEdit';

const MovieListComment = ({
	comment,
	imageUrl,
}: {
	comment: MovieListComment;
	imageUrl: string;
}) => {
	const commentUpdated = comment.createdAt != comment.updatedAt;
	const formattedDate = new Date(comment.createdAt).toLocaleString(
		navigator.language,
		{
			dateStyle: 'short',
			timeStyle: 'short',
		},
	);

	return (
		<Box key={comment.id} component={Paper} p={2}>
			<Grid container direction="column" spacing={2}>
				<Grid>
					<Grid container direction="row" alignItems="center">
						<Avatar
							alt="PlaceHolder Avatar"
							src={imageUrl}
							sx={{ height: '56px', width: '56px' }}
						/>
						<Typography
							display="inline"
							fontWeight="700"
							fontSize="1.2rem"
							ml={2}
						>
							{comment.username}
						</Typography>
						<Typography display="inline" mx={1}>
							{' '}
							&#x2022;{' '}
						</Typography>
						<Typography display="inline" variant="body2">
							{formattedDate}
						</Typography>
						{commentUpdated && (
							<Typography display="inline" ml={1} variant="body2">
								(Edited)
							</Typography>
						)}
					</Grid>
				</Grid>
				<MovieListCommentEdit
					commentText={comment.text}
					commentId={comment.id}
					commentUsername={comment.username}
				/>
			</Grid>
		</Box>
	);
};

export default MovieListComment;
