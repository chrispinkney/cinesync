import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Movie {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	description?: string;

	@Expose()
	genre: string[];

	@Expose()
	releaseDate: string;

	@Expose()
	posterUrl: string;

	@Expose()
	rating: number;

	@Expose()
	imdbId: string;
}

class User {
	@Expose()
	id: string;

	@Expose()
	username: string;

	@Expose()
	email: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	role: string;
}

export class ListCacheDto {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	isPrivate: boolean;

	@Expose()
	creatorId: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	@Type(() => User)
	@ValidateNested()
	user: User[];

	@Expose()
	@Type(() => Movie)
	@ValidateNested()
	movie: Movie[];
}
