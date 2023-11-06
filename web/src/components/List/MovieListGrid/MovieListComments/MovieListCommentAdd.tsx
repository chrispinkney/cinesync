import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useMovieList } from '@/context/movielist.context';
import { createComment } from '@/utils/cinesync-api/fetch-list';
import { useGlobalContext } from '@/context/store';
import Paper from '@mui/material/Paper';

const MovieListCommentAdd = ({ listId }: { listId: string }) => {
	const { token } = useGlobalContext();
	const { refreshMovieListContext } = useMovieList();

	const [text, setText] = useState<string>('');
	const [editing, setEditing] = useState<boolean>(false);

	const handleSubmit = async () => {
		// Set editing false before fetch to prevent multiple submissions
		inputRef.current?.blur();
		setEditing(false);
		const { success } = await createComment({
			token: token,
			body: { listId: listId, text: text },
		});
		if (success) {
			setText('');
			refreshMovieListContext();
		}
	};

	const handleCancel = () => {
		inputRef.current?.blur();
		setText('');
		setEditing(false);
	};

	const handleCommentTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		let newText = event.target.value;
		setText(newText);
		setEditing(newText ? true : false);
	};

	const inputRef = useRef<HTMLElement>(null);

	return (
		<Box
			component={Paper}
			p={2}
			alignItems="center"
			display="flex"
			flexDirection="row"
		>
			<Box flexGrow="100">
				<TextField
					label="Add a comment"
					value={text}
					multiline
					minRows={3}
					fullWidth
					inputRef={inputRef}
					onChange={handleCommentTextChange}
					onKeyDown={(e) =>
						e.key === 'Enter' && e.ctrlKey && text
							? handleSubmit()
							: e.key === 'Escape'
							? handleCancel()
							: null
					}
				/>
			</Box>
			{editing && (
				<Box ml={4}>
					<Tooltip title="Submit (Ctrl+Enter)">
						<span>
							<IconButton
								aria-label="submit"
								onClick={handleSubmit}
								disabled={!text}
							>
								<CheckCircleIcon fontSize="large" />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title="Cancel (Esc)">
						<IconButton aria-label="cancel" onClick={handleCancel}>
							<CancelIcon fontSize="large" />
						</IconButton>
					</Tooltip>
				</Box>
			)}
		</Box>
	);
};

export default MovieListCommentAdd;
