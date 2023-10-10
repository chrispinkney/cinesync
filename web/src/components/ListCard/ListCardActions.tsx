'use client';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import ListCardShareModal from '@/components/ListCard/ListCardShareModal';
import ListCardDeleteConfirmationModal from '@/components/ListCard/ListCardDeleteConfirmationModal';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

const ListCardActions = ({ listId }: { listId: number }) => {
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	const handleDeleteConfirmationOpen = () => setDeleteConfirmationOpen(true);
	const handleDeleteConfirmationClose = () => setDeleteConfirmationOpen(false);
	const handleShareModalOpen = () => setShareModalOpen(true);
	const handleShareModalClose = () => setShareModalOpen(false);

	return (
		<CardActions disableSpacing>
			<Tooltip title="Edit list">
				<IconButton
					aria-label="edit list"
					component={Link}
					href={`/list/${listId}`}
				>
					<EditIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="Share list">
				<IconButton aria-label="share list" onClick={handleShareModalOpen}>
					<ShareIcon />
				</IconButton>
			</Tooltip>

			<ListCardShareModal
				open={shareModalOpen}
				handleClose={handleShareModalClose}
				listId={listId}
			/>
			<Tooltip title="Delete list">
				<IconButton
					sx={{ marginLeft: 'auto' }}
					aria-label="delete list"
					onClick={handleDeleteConfirmationOpen}
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
			<ListCardDeleteConfirmationModal
				open={deleteConfirmationOpen}
				handleClose={handleDeleteConfirmationClose}
				listId={listId}
			/>
		</CardActions>
	);
};

export default ListCardActions;
