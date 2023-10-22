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
import GenreDisplay from './GenreDisplay';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Fragment, useState } from 'react';
import MovieListTableEditToolbar from './MovieListTableEditToolbar';
import { useMovieList } from '@/context/movielist.context';
import { useGlobalContext } from '@/context/store';

const MovieListTable = () => {
	const {
		movieList,
		refreshMovieListContext,
		movieListTableRows,
		setMovieListTableRows,
	} = useMovieList();

	const { token } = useGlobalContext();
	// We don't know all potential movie ids in db, so all ids for new movies added to data grid will start with 1M
	const [newMovieId, setNewMovieId] = useState(1000000);

	// States for save list action
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const addMovie = (movie: TmdbMovie) => {
		setMovieListTableRows((oldRows) => [
			{
				id: movie.id,
				title: movie.title,
				description: movie.overview,
				genre: movie.genres.map((genre) => genre.name),
				release_date: movie.release_date,
				poster_url: movie.poster_path,
				rating: movie.vote_average,
				imdb_id: movie.imdb_id,
				isNew: true,
			},
			...oldRows,
		]);
		setNewMovieId(newMovieId + 1);
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		setMovieListTableRows(
			movieListTableRows.map((row) => (row.id === newRow.id ? newRow : row)),
		);
		return newRow;
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
			`${process.env.NEXT_PUBLIC_URL}/lists/update`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `${token}`,
				},
				body: JSON.stringify({
					listId: movieList.id,
					Movie: movieListTableRows.map((row) => {
						return {
							title: row.title,
							description: row.description,
							genre: row.genre,
							release_date: row.release_date,
							poster_url: row.poster_url,
							rating: row.rating,
							imdb_id: row.imdb_id,
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
				`${process.env.NEXT_PUBLIC_URL}/lists/deleteMovie`,
				{
					method: 'DELETE',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `${token}`,
					},
					body: JSON.stringify({
						listId: movieList.id,
						movieId: rowId,
					}),
				},
			);
			if (response.ok) {
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
			editable: false,
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
			editable: false,
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
			renderCell: (params) => <GenreDisplay {...{ params }} />,
			headerAlign: 'center',
			sortable: false,
			filterable: false,
		},
		{
			field: 'release_date',
			headerName: 'Release Date',
			flex: 0.2,
			editable: false,
			headerAlign: 'center',
			align: 'center',
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
						key={id}
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
