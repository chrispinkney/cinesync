'use client';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import { Fragment, useState } from 'react';
import ListShareModal from '@/components/List/ListShareModal';
import ListDeleteConfirmationModal from '@/components/List/ListDeleteConfirmationModal';
import Tooltip from '@mui/material/Tooltip';

const ListActions = ({ listId }: { listId: number }) => {
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	const handleDeleteConfirmationOpen = () => setDeleteConfirmationOpen(true);
	const handleDeleteConfirmationClose = () => setDeleteConfirmationOpen(false);
	const handleShareModalOpen = () => setShareModalOpen(true);
	const handleShareModalClose = () => setShareModalOpen(false);

	return (
		<Fragment>
			<Tooltip title="Share list">
				<IconButton aria-label="share list" onClick={handleShareModalOpen}>
					<ShareIcon />
				</IconButton>
			</Tooltip>
			<ListShareModal
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
			<ListDeleteConfirmationModal
				open={deleteConfirmationOpen}
				handleClose={handleDeleteConfirmationClose}
				listId={listId}
			/>
		</Fragment>
	);
};

export default ListActions;
