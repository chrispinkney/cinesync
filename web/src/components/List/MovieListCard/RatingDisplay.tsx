import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

const RatingDisplay = ({ rating }: { rating: number }) => {
	let formattedRating = `${(Math.floor(rating * 10) / 10).toString()}/10`;
	let stars = Math.floor(rating) / 2;

	return (
		<>
			<Tooltip title={formattedRating}>
				<Box display={{ xs: 'none', sm: 'flex' }} justifyContent="right">
					{[1, 2, 3, 4, 5].map((i) => {
						if (i <= stars) {
							return <StarIcon fontSize="small" key={i} />;
						} else if (i > stars && i - 1 < stars) {
							return <StarHalfIcon fontSize="small" key={i} />;
						} else {
							return <StarBorderIcon fontSize="small" key={i} />;
						}
					})}
				</Box>
			</Tooltip>
			<Box display={{ xs: 'block', sm: 'none' }} textAlign="right">
				<Chip size="small" label={formattedRating} />
			</Box>
		</>
	);
};

export default RatingDisplay;
