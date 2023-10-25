import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useMovieList } from '@/context/movielist.context';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

const MovieListTitle = ({ name }: { name: string }) => {
	const { setMovieList, setListEdited } = useMovieList();
	const [title, setTitle] = useState<string>(name);
	const [editing, setEditing] = useState<boolean>(false);
	const handleEditClick = () => {
		setEditing(true);
	};

	const handleSubmitClick = () => {
		setMovieList((oldMovieList: MovieList | null) => {
			if (!oldMovieList) return null;
			return {
				...oldMovieList,
				name: title,
			};
		});
		setEditing(false);
		setListEdited(true);
	};

	const handleCancelClick = () => {
		setTitle(name);
		setEditing(false);
	};

	const handleTitleTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		let newTitle = event.target.value;
		setTitle(newTitle);
	};

	return (
		<Box display="flex" flexDirection="row" alignItems="center">
			{!editing ? (
				<>
					<Typography variant="h2" color="primary" mr={1}>
						{title}
					</Typography>
					<Box alignItems="center">
						<Tooltip title="Edit Title">
							<IconButton aria-label="edit" onClick={handleEditClick}>
								<EditIcon />
							</IconButton>
						</Tooltip>
					</Box>
				</>
			) : (
				<>
					<TextField
						variant="outlined"
						label="Movielist Title"
						value={title}
						autoFocus
						onChange={handleTitleTextChange}
						onKeyDown={(e) =>
							e.key === 'Enter' && title != name && title.length > 0
								? handleSubmitClick()
								: null
						}
					/>
					<Box alignItems="center">
						<Tooltip title="Submit">
							<span>
								<IconButton
									aria-label="submit"
									onClick={handleSubmitClick}
									disabled={title == name || title.length == 0}
								>
									<CheckCircleIcon fontSize="large" />
								</IconButton>
							</span>
						</Tooltip>

						<Tooltip title="Cancel">
							<IconButton aria-label="cancel" onClick={handleCancelClick}>
								<CancelIcon fontSize="large" />
							</IconButton>
						</Tooltip>
					</Box>
				</>
			)}
		</Box>
	);
};

export default MovieListTitle;
