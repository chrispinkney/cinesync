import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import MovieActions from './MovieActions';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import RatingDisplay from './RatingDisplay';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';

const MovieListCard = ({ movie }: { movie: MovieItem }) => {
	const [descriptionExpanded, setDescriptionExpanded] =
		useState<boolean>(false);

	const handleExpandClick = () => {
		setDescriptionExpanded(!descriptionExpanded);
	};

	return (
		<Grid xs={12} md={6} xl={4}>
			<Card>
				<Grid
					container
					direction="row"
					spacing={2}
					p={2}
					minHeight={{ xs: '50vw', sm: '39vw', md: '27vw', xl: '18vw' }}
				>
					<Grid xs={4} sm={3} md={4} lg={4} xl={4}>
						{movie.poster_url && (
							<Box display="flex" alignItems="center" height="100%">
								{/* eslint-disable-next-line @next/next/no-img-element*/}
								<img
									width="100%"
									src={`https://image.tmdb.org/t/p/w185${movie.poster_url}`}
									alt=""
								/>
							</Box>
						)}
					</Grid>
					<Grid xs={8} sm={9} md={8} lg={8} xl={8} position="relative">
						<Stack width="100%" spacing={1}>
							<Grid container direction="row" width="100%">
								<Grid xs={9} lg={8}>
									<Typography
										display="-webkit-box"
										fontSize={{ xs: 16, md: 20 }}
										overflow="hidden"
										textOverflow="ellipsis"
										sx={{
											WebkitLineClamp: '1',
											WebkitBoxOrient: 'vertical',
										}}
									>
										{movie.title}
									</Typography>
								</Grid>
								<Grid xs={3} lg={4}>
									<RatingDisplay rating={movie.rating} />
								</Grid>
							</Grid>
							<Grid container direction="row" width="100%">
								<Typography
									fontSize={15}
									color="text.secondary"
									alignSelf="center"
								>
									(
									{movie.release_date.length == 0
										? 'unknown'
										: movie.release_date.slice(0, 4)}
									)
								</Typography>
								<Box display={{ xs: 'flex', sm: 'none' }} ml="auto">
									<IconButton onClick={handleExpandClick}>
										{descriptionExpanded ? (
											<ExpandLessIcon />
										) : (
											<ExpandMoreIcon />
										)}
									</IconButton>
								</Box>
							</Grid>

							<Box
								height="24px"
								display={{ xs: 'none', sm: 'flex' }}
								flexWrap="wrap"
								overflow="hidden"
								gap={0.8}
							>
								{movie.genre.map((value) => (
									<Chip
										key={value}
										label={value}
										size="small"
										color="primary"
										variant="outlined"
									/>
								))}
							</Box>
							<Divider sx={{ display: { xs: 'none', sm: 'block' }, my: 1 }} />
							<Typography
								display={{ xs: 'none', sm: '-webkit-box' }}
								fontSize={12}
								overflow="hidden"
								textOverflow="ellipsis"
								sx={{
									WebkitLineClamp: '3',
									WebkitBoxOrient: 'vertical',
								}}
							>
								{movie.description}
							</Typography>

							<Collapse in={descriptionExpanded} timeout="auto" unmountOnExit>
								<Box
									height="24px"
									display={{ xs: 'flex', sm: 'none' }}
									flexWrap="wrap"
									overflow="hidden"
									gap={0.8}
									mb={1}
								>
									{movie.genre.map((value) => (
										<Chip
											key={value}
											label={value}
											size="small"
											color="primary"
											variant="outlined"
										/>
									))}
								</Box>
								<Typography
									fontSize={12}
									pb="40px"
									display={{ xs: 'block', sm: 'none' }}
								>
									{movie.description}
								</Typography>
							</Collapse>
						</Stack>
						<Box
							position="absolute"
							bottom={0}
							display="flex"
							alignItems="center"
							width="100%"
							pr={2}
						>
							<MovieActions movie={movie} />
						</Box>
					</Grid>
				</Grid>
			</Card>
		</Grid>
	);
};

export default MovieListCard;
