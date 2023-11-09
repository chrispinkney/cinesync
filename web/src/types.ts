// Typescript Common Types

type NavigationLink = {
	text: string;
	href: string;
	icon: any;
};

type MovieItem = {
	id: string;
	title: string;
	description: string;
	genre: string[];
	releaseDate: string;
	posterUrl: string;
	rating: number;
	imdbId: string;
	isNew?: boolean;
};

type MovieListLite = {
	id: string;
	name: string;
	isPrivate: boolean;
	creatorId: string;
	createdAt?: string;
	updatedAt?: string;
	movie: MovieItem[];
};

type MovieList = MovieListLite & {
	user: User[];
	comments: MovieListComment[];
};

type MovieListComment = {
	id: string;
	username: string;
	text: string;
	createdAt: string;
	updatedAt: string;
};

type User = {
	id: string;
	username: string;
	email: string;
};

type ShareeUser = {
	username: string;
	email: string;
	creator: boolean;
	watched: string[];
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
	vote_average: number;
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

// DTO - Cinesync API
// Fetch Data Types
type MovieDto = {
	title: string;
	description?: string;
	genre: string[];
	releaseDate?: string;
};

type CreateListDto = {
	name: string;
	movie?: MovieDto[];
};

type CreateCommentDto = {
	listId: string;
	text: string;
};

type UpdateListDto = {
	listId: string;
	name?: string;
	movie: MovieDto[];
};

type UpdateCommentDto = {
	listId: string;
	commentId: string;
	text: string;
};

type CreateUserDto = {
	username: string;
	email: string;
	password: string;
};

type SigninUserDto = {
	email: string;
	password: string;
};

type UpdateUserDto = {
	username?: string;
	email?: string;
	password?: string;
};

type updateUserFriendsDto = {
	username: string;
	status: string;
};

type FriendsDto = {
	username: string;
	status: string;
};

type sendUserFriendRequestDto = {
	username: string;
};

// Fetch Return Data Types
type CinesyncFetchReturnDto =
	| ListsReturnDto
	| ListReturnDto
	| ShareeReturnDto
	| UserReturnDto
	| TokenReturnDto
	| AvatarReturnDto
	| EmptyReturnDto
	| UserFriendsDto;

type ErrorReturnDto = {
	success: boolean;
	fetchResponseJson: {
		statusCode?: number;
		message?: string;
	};
};

type ListsReturnDto =
	| {
			success: boolean;
			fetchResponseJson: { list: MovieListLite[] };
	  }
	| ErrorReturnDto;

type ListReturnDto =
	| {
			success: boolean;
			fetchResponseJson: { list: MovieList };
	  }
	| ErrorReturnDto;

type ShareeReturnDto =
	| {
			success: boolean;
			fetchResponseJson: ShareeUserReturnDto[];
	  }
	| ErrorReturnDto;

type ShareeUserReturnDto = ShareeUser | ErrorReturnDto;

type UserReturnDto =
	| {
			success: boolean;
			fetchResponseJson: User;
	  }
	| ErrorReturnDto;

type TokenReturnDto =
	| {
			success: boolean;
			fetchResponseJson: { accessToken: string };
	  }
	| ErrorReturnDto;

type AvatarReturnDto =
	| {
			success: boolean;
			fetchResponseJson: { imageUrl: string };
	  }
	| ErrorReturnDto;

type EmptyReturnDto =
	| {
			success: boolean;
			fetchResponseJson: {};
	  }
	| ErrorReturnDto;

type UserFriendsDto =
	| {
			success: boolean;
			fetchResponseJson: FriendsDto[];
	  }
	| ErrorReturnDto;
