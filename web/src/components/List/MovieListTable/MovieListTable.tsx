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
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import GenreDropDown from './GenreDropdown';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Fragment, useState } from 'react';
import MovieListTableEditToolbar from './MovieListTableEditToolbar';

const MovieListTable = (movieList: MovieList) => {
	// Add id to each movie for mui datagrid
	const initialRows: GridRowsProp = movieList.Movie.map((movie, index) => ({
		...movie,
		id: index + 1,
	}));
	const [rows, setRows] = useState(initialRows);
	const [newMovieId, setNewMovieId] = useState(initialRows.length + 1);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const addMovie = () => {
		setRows((oldRows) => [
			...oldRows,
			{
				id: newMovieId,
				title: '',
				description: '',
				genre: [],
				release_year: '',
				isNew: true,
			},
		]);
		setNewMovieId(newMovieId + 1);
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	const updateGenres = (row: GridRowModel) => {
		processRowUpdate(row);
	};

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (
		params,
		event,
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const saveList = async () => {
		setLoading(true);
		console.dir(rows);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_URL}/lists/update/${movieList.id}`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					Movie: rows.map((row) => {
						return {
							title: row.title,
							description: row.description,
							genre: row.genre,
							release_year: parseInt(row.release_year),
						};
					}),
				}),
			},
		);

		if (response.ok) {
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 1000);
		} else {
			setSuccess(false);
		}
		setLoading(false);
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
			renderCell: (params) => <GenreDropDown {...{ params, updateGenres }} />,
			headerAlign: 'center',
			sortable: false,
			filterable: false,
		},
		{
			field: 'release_year',
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

	return (
		<Fragment>
			<Box component={Paper} sx={{ width: '100%', mt: 3 }}>
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
						toolbar: MovieListTableEditToolbar,
					}}
					slotProps={{
						toolbar: { addMovie, saveList, loading, success },
					}}
				/>
			</Box>
		</Fragment>
	);
};

export default MovieListTable;
