export const searchTmdbMovies = async (searchText: string) => {
	const res = await fetch(
		'https://api.themoviedb.org/3/search/movie?' +
			new URLSearchParams({
				query: searchText,
				include_adult: 'false',
				language: 'en-US',
				page: '1',
			}),
		{
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);
	const movieSearchResults = await res.json();
	return movieSearchResults;
};

export const fetchTmdbMovie = async (movieId: number) => {
	const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
		},
	});
	const movieDetails = await res.json();
	return movieDetails;
};
