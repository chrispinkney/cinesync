import { useMovieList } from '@/context/movielist.context';
import { useGlobalContext } from '@/context/store';
import { getAvatarByUsername } from '@/utils/cinesync-api/fetch-user';
import { useEffect, useState } from 'react';
import MovieListComment from './MovieListComment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MovieListCommentAdd from './MovieListCommentAdd';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

type UserAvatar = { [key: string]: string };

const MovieListComments = () => {
	const { movieList } = useMovieList();
	const { token } = useGlobalContext();
	const [userAvatars, setUserAvatars] = useState<UserAvatar>({});
	const [trimComments, setTrimComments] = useState<boolean>(
		movieList.comments.length > 3,
	);

	const handleLoadMoreClick = () => {
		setTrimComments(false);
	};

	useEffect(() => {
		const fetchAvatars = async () => {
			// Remove duplicate users to prevent unneccessary fetches
			const users = movieList.comments
				.map((comment) => comment.username)
				.filter((value, index, self) => {
					return self.indexOf(value) === index;
				});
			// Create promises for each user to fetch their avatar
			const userAvatarPromises: Promise<string>[] = [];
			users.forEach((user) =>
				userAvatarPromises.push(
					new Promise(async (resolve, reject) => {
						const { success, fetchResponseJson } = await getAvatarByUsername({
							token,
							username: user,
						});
						if (success && 'imageUrl' in fetchResponseJson) {
							resolve(fetchResponseJson.imageUrl);
						} else {
							resolve('');
						}
					}),
				),
			);
			// Wait for all promises to complete and return array of avatar urls
			const imageUrls = await Promise.all(userAvatarPromises);
			// Set object of type with key value pairs of username and avatar url for jsx reference
			const newUserAvatars = users.reduce((acc, val, i) => {
				return { ...acc, [val]: imageUrls[i] };
			}, {});
			setUserAvatars(newUserAvatars);
		};

		fetchAvatars();
	}, [movieList.comments, token]);

	return (
		<>
			<Stack mt={5} spacing={2}>
				<Divider />
				<Typography variant="h4">Comments</Typography>
				<MovieListCommentAdd listId={movieList.id} />
				{movieList.comments
					.slice(0, trimComments ? 3 : movieList.comments.length)
					.map((comment: MovieListComment) => (
						<MovieListComment
							key={comment.id}
							comment={comment}
							imageUrl={userAvatars[comment.username] ?? ''}
						/>
					))}
			</Stack>
			{trimComments && (
				<Box display="flex" justifyContent="center" mt={5}>
					<Button variant="outlined" onClick={handleLoadMoreClick}>
						Load More
					</Button>
				</Box>
			)}
		</>
	);
};

export default MovieListComments;
