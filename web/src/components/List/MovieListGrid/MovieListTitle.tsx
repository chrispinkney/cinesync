import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@mui/icons-material/Undo';
import { useMovieList } from '@/context/movielist.context';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user.context';

const MovieListTitle = ({
	name,
	creatorId,
}: {
	name: string;
	creatorId: string;
}) => {
	const { replace } = useRouter();
	const { setMovieList, setListEdited } = useMovieList();
	const { user } = useUser();
	const { id: userId } = user;

	const [title, setTitle] = useState<string>(name);
	const [editing, setEditing] = useState<boolean>(false);

	const canEdit = creatorId === userId;

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
			<Tooltip title="Back to lists">
				<Fab
					size="small"
					color="primary"
					aria-label="listsPage"
					onClick={() => {
						replace('/dashboard');
					}}
					sx={{ marginRight: 2 }}
				>
					<UndoIcon />
				</Fab>
			</Tooltip>
			{!editing ? (
				<>
					<Typography
						variant="h2"
						color="primary"
						mr={1}
						fontSize="calc(20px + 2vw)"
					>
						{title}
						{canEdit && (
							<Tooltip title="Edit Title">
								<IconButton aria-label="edit" onClick={handleEditClick}>
									<EditIcon />
								</IconButton>
							</Tooltip>
						)}
					</Typography>
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
