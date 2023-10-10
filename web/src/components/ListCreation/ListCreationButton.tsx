'use client';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { Fragment, useState } from 'react';
import ListCreationModal from '@/components/ListCreation/ListCreationModal';

const ListCreationButton = () => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<Fragment>
			<Tooltip title="Add new list">
				<Fab
					color="primary"
					aria-label="add"
					onClick={handleOpen}
					sx={{ position: 'fixed', bottom: 16, right: 16 }}
				>
					<AddIcon />
				</Fab>
			</Tooltip>
			<ListCreationModal open={open} handleClose={handleClose} />
		</Fragment>
	);
};

export default ListCreationButton;
