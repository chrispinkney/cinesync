'use client';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import ListShareModal from '@/components/List/ListShareModal';
import Tooltip from '@mui/material/Tooltip';
import { useGlobalContext } from '@/context/store';
import ListShareeAvatars from './ListGrid/ListShareeAvatars';
import {
	getListSharees,
	deleteList,
	toggleListPrivacy,
} from '@/utils/cinesync-api/fetch-list';
import { usePathname, useRouter } from 'next/navigation';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog/DeleteConfirmationDialog';

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
	const { replace } = useRouter();
	const pathname = usePathname();
	const { token } = useGlobalContext();
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [sharees, setSharees] = useState<ShareeUserReturnDto[]>([]);

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

	const handleDeleteClick = () => {
		setDeleteConfirmationOpen(true);
	};

	const handleDeleteConfirm = async () => {
		// Send delete request to api
		const { success } = await deleteList({
			token: token,
			listId: listId,
		});
		if (success) {
			setDeleteConfirmationOpen(false);
			// Redirect to /dashboard
			if (pathname == '/dashboard') {
				refreshContext();
			} else {
				replace('/dashboard');
			}
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
					onClick={handleDeleteClick}
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
			<DeleteConfirmationDialog
				open={deleteConfirmationOpen}
				deletionItemDescription={`the movie list "${name}"`}
				handleConfirm={handleDeleteConfirm}
				handleCancel={() => setDeleteConfirmationOpen(false)}
			/>
		</>
	);
};

export default ListActions;
