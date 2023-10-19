// Typescript Common Types

type NavigationLink = {
	text: string;
	href: string;
	icon: any;
};

type MovieItem = {
	id?: string;
	title: string;
	description?: string;
	genre: string[];
	release_date: string;
	poster_url: string;
	rating: number;
	imdb_id: string;
};

type MovieList = {
	id: string;
	name: string;
	is_private?: boolean;
	creator_id?: number;
	created_at?: Date;
	updated_at?: Date;
	Movie: MovieItem[];
};

type User = {
	id: string;
	username: string;
	email: string;
	password?: string;
	created_at?: Date;
	updated_at?: Date;
	role: Role;
	lists: MovieList[];
};

enum Role {
	ADMIN,
	USER,
}

// TMDB API Data Types

type TmdbMovie = Omit<TmdbMovieLite, 'genre_ids'> & {
	belongs_to_collection?: TmdbCollection;
	budget?: number;
	genres: TmdbGenres[];
	homepage?: string;
	imdb_id: string;
	production_companies?: TmdbProductionCompanies[];
	production_countries?: TmdbProductionCountries[];
	revenue?: number;
	runtime?: number;
	spoken_languages?: TmdbSpokenLanguages[];
	status?: string;
	tagline?: string;
};

type TmdbMovieSearchResults = {
	page?: number;
	results: TmdbMovieLite[];
	total_pages?: number;
	total_results?: number;
};

type TmdbMovieLite = {
	adult?: boolean;
	backdrop_path?: string;
	genre_ids: number[];
	id: number;
	original_language?: string;
	original_title?: string;
	overview: string;
	popularity?: number;
	poster_path: string;
	release_date: string;
	title: string;
	video?: boolean;
	vote_average?: number;
	vote_count?: number;
};

type TmdbCollection = {
	id: number;
	name: string;
	poster_path: string;
	backdrop_path: string;
};

type TmdbGenres = {
	id: number;
	name: string;
};

type TmdbProductionCompanies = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};

type TmdbProductionCountries = {
	iso_3166_1: string;
	name: string;
};

type TmdbSpokenLanguages = {
	english_name: string;
	iso_639_1: string;
	name: string;
};
