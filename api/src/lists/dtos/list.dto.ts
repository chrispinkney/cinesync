import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class MovieItem {
	@Expose()
	id: number;

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

class ListItem {
	@Expose()
	id: number;

	@Expose()
	name: string;

	@Expose()
	isPrivate: boolean;

	@Expose()
	creatorId: number;

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
