import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserDto } from '../../users/dtos/user.dto';
import { CommentDto } from './comments.dto';

class Movie {
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

class List {
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
	@Type(() => Movie)
	@ValidateNested()
	movie: Movie[];

	@Expose()
	@Type(() => UserDto)
	@ValidateNested()
	user: UserDto[];

	@Expose()
	@Type(() => CommentDto)
	@ValidateNested()
	comments: CommentDto[];
}

export class CreateListReturn {
	@Expose()
	@Type(() => List)
	@ValidateNested()
	list: List;
}
