import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useMovieList } from '@/context/movielist.context';
import { deleteComment, updateComment } from '@/utils/cinesync-api/fetch-list';
import { useGlobalContext } from '@/context/store';
import { useUser } from '@/context/user.context';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog/DeleteConfirmationDialog';

const MovieListCommentEdit = ({
	commentText,
	commentId,
	commentUsername,
}: {
	commentText: string;
	commentId: string;
	commentUsername: string;
}) => {
	const { token } = useGlobalContext();
	const { movieList, refreshMovieListContext } = useMovieList();
	const { id } = movieList;

	const { user } = useUser();
	const enableEditing = user.username == commentUsername;
	const enableDeletion =
		enableEditing || user.username == movieList.user[0].username;

	const [text, setText] = useState<string>(commentText);
	const [editing, setEditing] = useState<boolean>(false);
	const [editText, setEditText] = useState<string>(text);
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
		useState<boolean>(false);

	const handleEditClick = () => {
		setEditing(true);
	};

	const handleDeleteClick = () => {
		setDeleteConfirmationOpen(true);
	};

	const handleDeleteConfirm = async () => {
		const { success } = await deleteComment({
			token: token,
			listId: id,
			commentId: commentId,
		});
		if (success) {
			refreshMovieListContext();
		}
		setEditing(false);
	};

	const handleSubmitClick = async () => {
		const { success } = await updateComment({
			token: token,
			body: { listId: id, commentId: commentId, text: editText },
		});
		if (success) {
			setText(editText);
		}
		setEditing(false);
	};

	const handleCancelClick = () => {
		setEditText(text);
		setEditing(false);
	};

	const handleCommentTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		let newText = event.target.value;
		setEditText(newText);
	};

	return (
		<>
			{!editing ? (
				<>
					<Grid>
						<Typography>{editText}</Typography>
					</Grid>
					{enableDeletion && (
						<Grid>
							<Box>
								{enableEditing && (
									<Tooltip title="Edit Comment">
										<IconButton aria-label="edit" onClick={handleEditClick}>
											<EditIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								)}
								<Tooltip title="Delete Comment">
									<IconButton aria-label="delete" onClick={handleDeleteClick}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</Box>
						</Grid>
					)}
				</>
			) : (
				<>
					<TextField
						variant="outlined"
						label="Comment Text"
						value={editText}
						autoFocus
						onChange={handleCommentTextChange}
						onKeyDown={(e) =>
							e.key === 'Enter' && editText != text && editText.length > 0
								? handleSubmitClick()
								: e.key === 'Escape'
								? handleCancelClick()
								: null
						}
					/>
					<Grid>
						<Box>
							<Tooltip title="Submit">
								<span>
									<IconButton
										aria-label="submit"
										onClick={handleSubmitClick}
										disabled={editText == text || editText.length == 0}
									>
										<CheckCircleIcon fontSize="small" />
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title="Cancel">
								<IconButton aria-label="cancel" onClick={handleCancelClick}>
									<CancelIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</Box>
					</Grid>
				</>
			)}
			<DeleteConfirmationDialog
				open={deleteConfirmationOpen}
				deletionItemDescription="this comment"
				handleConfirm={handleDeleteConfirm}
				handleCancel={() => setDeleteConfirmationOpen(false)}
			/>
		</>
	);
};

export default MovieListCommentEdit;
