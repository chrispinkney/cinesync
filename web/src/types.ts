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
	release_year: number;
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
