'use client';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { GridRowModel, GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';

type GenreDropDownProps = {
	params: GridRenderCellParams;
	updateGenres: (row: GridRowModel) => void;
};

const GenreDropDown = ({ params, updateGenres }: GenreDropDownProps) => {
	const { row, value } = params;
	const initialGenres: string[] = value;
	const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenres);

	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: 400,
				width: 250,
			},
		},
	};

	const genres = [
		'Action',
		'Adventure',
		'Animation',
		'Biography',
		'Comedy',
		'Crime',
		'Documentary',
		'Drama',
		'Family',
		'Fantasy',
		'Film-Noir',
		'History',
		'Horror',
		'Music',
		'Musical',
		'Mystery',
		'Romance',
		'Sci-Fi',
		'Sport',
		'Thriller',
		'War',
		'Western',
	];

	const handleChange = (event: SelectChangeEvent<typeof selectedGenres>) => {
		const {
			target: { value },
		} = event;
		let updatedGenres: string[] =
			typeof value === 'string' ? value.split(',') : value;
		setSelectedGenres(updatedGenres);
		let updatedRow = row;
		updatedRow.genre = updatedGenres;
		updateGenres(updatedRow);
	};

	return (
		<FormControl sx={{ width: '100%' }}>
			<Select
				labelId="genre-label"
				id="genre"
				multiple
				value={selectedGenres}
				onChange={handleChange}
				input={<Input id="genre" disableUnderline />}
				renderValue={(selected) => (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
						{selected.map((value) => (
							<Chip key={value} label={value} />
						))}
					</Box>
				)}
				MenuProps={MenuProps}
			>
				{genres.map((genre) => (
					<MenuItem key={genre} value={genre}>
						<Checkbox checked={selectedGenres.indexOf(genre) > -1} />
						<ListItemText primary={genre} />
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default GenreDropDown;
