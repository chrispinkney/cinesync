'use client';
import { useState } from 'react';
import Grow from '@mui/material/Grow';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

const MovieListTable = ({ movies }: MovieList) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);

	const headers = Object.keys(movies[0]);

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Grow in={true}>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<Checkbox
										color="primary"
										// indeterminate={numSelected > 0 && numSelected < rowCount}
										// checked={rowCount > 0 && numSelected === rowCount}
										// onChange={onSelectAllClick}
										inputProps={{
											'aria-label': 'select all movies',
										}}
									/>
								</TableCell>
								{headers.map((header) => (
									<TableCell key={header} align={'center'}>
										{header}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{movies
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((movie) => {
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={movie.title}
										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													// checked={isItemSelected}
													// inputProps={{
													//   'aria-labelledby': labelId,
													// }}
												/>
											</TableCell>
											{Object.values(movie).map((value) => {
												return (
													<TableCell key={value} align={'center'}>
														{value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, { value: -1, label: 'All' }]}
					component="div"
					count={movies.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Grow>
	);
};

export default MovieListTable;
