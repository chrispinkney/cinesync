import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserDto } from '../../users/dtos/user.dto';

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
	release_date: string;

	@Expose()
	poster_url: string;

	@Expose()
	rating: string;

	@Expose()
	imdb_id: string;
}

class List {
	@Expose()
	id: number;

	@Expose()
	name: string;

	@Expose()
	is_private: boolean;

	@Expose()
	creator_id: number;

	@Expose()
	created_at: Date;

	@Expose()
	updated_at: Date;

	@Expose()
	@Type(() => Movie)
	@ValidateNested()
	Movie: Movie[];

	@Expose()
	@Type(() => UserDto)
	@ValidateNested()
	User: UserDto[];
}

export class CreateListReturn {
	@Expose()
	@Type(() => List)
	@ValidateNested()
	list: List;
}
