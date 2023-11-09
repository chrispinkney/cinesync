'use client';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import ListShareModal from '@/components/List/ListShareModal';
import ListDeleteConfirmationModal from '@/components/List/ListDeleteConfirmationModal';
import Tooltip from '@mui/material/Tooltip';
import {
	getListSharees,
	toggleListPrivacy,
} from '@/utils/cinesync-api/fetch-list';
import { useGlobalContext } from '@/context/store';
import ListShareeAvatars from './ListGrid/ListShareeAvatars';

const ListActions = ({
	listId,
	name,
	isPrivate,
	refreshContext,
}: {
	listId: string;
	name: string;
	isPrivate: boolean;
	refreshContext: () => Promise<void>;
}) => {
	const { token } = useGlobalContext();
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [sharees, setSharees] = useState<ShareeUserReturnDto[]>([]);

	const handleDeleteConfirmationOpen = () => setDeleteConfirmationOpen(true);
	const handleDeleteConfirmationClose = () => setDeleteConfirmationOpen(false);
	const handleShareModalOpen = () => setShareModalOpen(true);
	const handleShareModalClose = () => setShareModalOpen(false);

	const handlePrivacyClick = async () => {
		const { success } = await toggleListPrivacy({ token, listId });
		if (success) {
			refreshContext();
		}
	};

	const getListShareesUsers = async () => {
		const { success, fetchResponseJson } = await getListSharees({
			token: token,
			listId: listId,
		});
		if (success && Array.isArray(fetchResponseJson)) {
			setSharees(fetchResponseJson);
		}
	};

	useEffect(() => {
		getListShareesUsers();
	}, []);

	return (
		<>
			<Tooltip title="Share list">
				<IconButton
					sx={{
						'&:hover': {
							backgroundColor: 'info.main',
							color: 'info.contrastText',
						},
					}}
					aria-label="share list"
					onClick={handleShareModalOpen}
				>
					<ShareIcon />
				</IconButton>
			</Tooltip>
			<ListShareModal
				open={shareModalOpen}
				setShareModalOpen={setShareModalOpen}
				handleClose={handleShareModalClose}
				listId={listId}
				name={name}
				getListShareesUsers={getListShareesUsers}
			/>
			<Tooltip title={isPrivate ? 'Private' : 'Public'}>
				<IconButton
					sx={{
						'&:hover': {
							backgroundColor: 'info.main',
							color: 'info.contrastText',
						},
					}}
					aria-label="toggle privacy"
					onClick={handlePrivacyClick}
				>
					{isPrivate ? <VisibilityOffIcon /> : <VisibilityIcon />}
				</IconButton>
			</Tooltip>
			<ListShareeAvatars token={token} sharees={sharees} />
			<Tooltip title="Delete list">
				<IconButton
					sx={{
						marginLeft: 'auto',
						'&:hover': {
							backgroundColor: 'error.main',
							color: 'error.contrastText',
						},
					}}
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
				refreshContext={refreshContext}
				name={name}
			/>
		</>
	);
};

export default ListActions;
