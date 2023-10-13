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
import Grow from '@mui/material/Grow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import GenreDropDown from './GenreDropdown';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Fragment, useState } from 'react';
import MovieListTableEditToolbar from './MovieListTableEditToolbar';
import ListActions from '../ListActions';

const MovieListTable = (movieList: MovieList) => {
	const initialRows: GridRowsProp = movieList.movies;
	const [rows, setRows] = useState(initialRows);
	const [newMovieId, setNewMovieId] = useState(initialRows.length);

	const addMovie = () => {
		setRows((oldRows) => [
			...oldRows,
			{
				newMovieId,
				title: '',
				description: '',
				genre: [],
				year: '',
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
		console.dir(rows);
		// const response = await fetch(
		// 	`${process.env.NEXT_PUBLIC_URL}/lists/update/${id}`,
		// 	{
		// 		method: 'PATCH',
		// 		headers: {
		// 			Accept: 'application/json',
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify({
		// 			updateListDto: {
		// 				Movie: rows.map((row) => {
		// 					return {
		// 						title: row.title,
		// 						description: row.description,
		// 						genre: row.genre,
		// 						release_year: row.year,
		// 					};
		// 				}),
		// 			},
		// 		}),
		// 	},
		// );
		// alert(response.statusText);
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
						toolbar: { addMovie, saveList },
					}}
				/>
			</Box>
		</Fragment>
	);
};

export default MovieListTable;
