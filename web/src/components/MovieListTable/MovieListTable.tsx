'use client';
import {
	DataGrid,
	GridActionsCellItem,
	GridColDef,
	GridEventListener,
	GridPreProcessEditCellProps,
	GridRowEditStopReasons,
	GridRowId,
	GridRowModel,
	GridRowsProp,
	GridToolbarContainer,
} from '@mui/x-data-grid';
import Grow from '@mui/material/Grow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import GenreDropDown from './GenreDropdown';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

interface EditToolbarProps {
	highestId: number;
	setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
	saveList: () => void;
}

const MovieListTable = ({ id, name, movies }: MovieList) => {
	const processRowUpdate = (newRow: GridRowModel) => {
		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	// Add callback function to rows to allow rendered cell (genres) to update row data
	const initialRows: GridRowsProp = movies.map((element) => {
		return {
			...element,
			updateGenres: (updatedRow: GridRowModel) => processRowUpdate(updatedRow),
		};
	});
	const [rows, setRows] = useState(initialRows);

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (
		params,
		event,
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const saveList = async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_URL}/lists/update/${id}`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					updateListDto: {
						Movie: rows.map((row) => {
							return {
								title: row.title,
								description: row.description,
								genre: row.genre,
								release_year: row.year,
							};
						}),
					},
				}),
			},
		);
		alert(response.statusText);
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		setRows(rows.filter((row) => row.id !== id));
	};

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: 'ID',
			flex: 0.1,
			headerAlign: 'center',
			align: 'center',
			editable: false,
		},
		{
			field: 'title',
			headerName: 'Title',
			flex: 0.6,
			editable: true,
			headerAlign: 'center',
			preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
				const hasError = params.props.value.length < 1;
				return { ...params.props, error: hasError };
			},
		},
		{
			field: 'description',
			headerName: 'Description',
			flex: 1,
			editable: true,
			headerAlign: 'center',
			preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
				const hasError = params.props.value.length < 1;
				return { ...params.props, error: hasError };
			},
		},
		{
			field: 'genre',
			headerName: 'Genres',
			flex: 1,
			editable: true,
			renderCell: GenreDropDown,
			headerAlign: 'center',
			sortable: false,
			filterable: false,
		},
		{
			field: 'year',
			headerName: 'Release Year',
			flex: 0.2,
			editable: true,
			headerAlign: 'center',
			align: 'center',
			preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
				const hasError = params.props.value.length != 4;
				return { ...params.props, error: hasError };
			},
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			flex: 0.3,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];

	const EditToolbar = (props: EditToolbarProps) => {
		const { highestId, setRows, saveList } = props;
		const [newId, setNewId] = useState(highestId);

		const handleAddClick = () => {
			const id = newId;
			setNewId(newId + 1);
			setRows((oldRows) => [
				...oldRows,
				{
					id,
					title: '',
					description: '',
					genre: [],
					year: '',
					updateGenres: (updatedRow: GridRowModel) =>
						processRowUpdate(updatedRow),
					isNew: true,
				},
			]);
		};

		const handleSaveClick = () => {
			saveList();
		};

		return (
			<GridToolbarContainer sx={{ p: 1 }}>
				<Tooltip title="Add movie">
					<IconButton onClick={handleAddClick}>
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Save list">
					<IconButton
						aria-label="save list"
						onClick={handleSaveClick}
						sx={{ ml: 'auto' }}
					>
						<SaveIcon />
					</IconButton>
				</Tooltip>
			</GridToolbarContainer>
		);
	};

	return (
		<Grow in={true}>
			<Box component={Paper} sx={{ width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
						columns: {
							columnVisibilityModel: {
								id: false,
							},
						},
					}}
					pageSizeOptions={[10, 25, 50]}
					slots={{
						toolbar: EditToolbar,
					}}
					slotProps={{
						toolbar: { highestId: movies.length, setRows, saveList },
					}}
				/>
			</Box>
		</Grow>
	);
};

export default MovieListTable;
