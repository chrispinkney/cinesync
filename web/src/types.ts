// Typescript Common Types

type NavigationLink = {
	text: string;
	href: string;
	icon: any;
};

type Movie = {
	id?: number;
	title: string;
	description?: string;
	genre: string;
	year: number;
};

type MovieList = {
	id: number;
	name: string;
	is_private?: boolean;
	creator_id?: number;
	created_at?: Date;
	updated_at?: Date;
	movies: Movie[];
	users?: User[];
};

type User = {
	id: number;
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
