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
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import GenreDropDown from './GenreDropdown';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Fragment, useState } from 'react';
import MovieListTableEditToolbar from './MovieListTableEditToolbar';
import { useMovieList } from '@/context/movielist.context';

const MovieListTable = () => {
	const {
		movieList,
		refreshMovieListContext,
		movieListTableRows,
		setMovieListTableRows,
	} = useMovieList();

	// We don't know all potential movie ids in db, so all ids for new movies added to data grid will start with 1M
	const [newMovieId, setNewMovieId] = useState(1000000);

	// States for save list action
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const addMovie = () => {
		setMovieListTableRows((oldRows) => [
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
		setMovieListTableRows(
			movieListTableRows.map((row) => (row.id === newRow.id ? newRow : row)),
		);
		return newRow;
	};

	// Callback for rendered GenreDropDown cells
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
					Movie: movieListTableRows.map((row) => {
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
				refreshMovieListContext();
			}, 1000);
		} else {
			setSuccess(false);
		}
		setLoading(false);
	};

	const handleDeleteClick = async (rowId: GridRowId) => {
		const rowIsNew: boolean = movieListTableRows.find((row) => row.id == rowId)
			?.isNew;
		if (rowIsNew) {
			setMovieListTableRows(
				movieListTableRows.filter((row) => row.id !== rowId),
			);
		} else {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}/lists/delete/${movieList.id}/${rowId}`,
				{
					method: 'DELETE',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				},
			);
			if (response.ok) {
				alert('deleted');
				refreshMovieListContext();
				setMovieListTableRows(
					movieListTableRows.filter((row) => row.id !== rowId),
				);
			}
		}
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
			editable: false,
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
						onClick={() => handleDeleteClick(id)}
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
					rows={movieListTableRows}
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
