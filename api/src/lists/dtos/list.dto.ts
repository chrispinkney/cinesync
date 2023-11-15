import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class MovieItem {
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
	rating: string;

	@Expose()
	imdbId: string;
}

export class ListItem {
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
	movie: MovieItem[];
}

export class ListDto {
	@Expose()
	username: string;

	@Expose()
	email: string;

	@Expose()
	@Type(() => ListItem)
	@ValidateNested()
	list: ListItem[];

	@Expose()
	@Type(() => MovieItem)
	@ValidateNested()
	movie: MovieItem[];
}
