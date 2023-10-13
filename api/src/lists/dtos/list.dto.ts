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
	release_year?: number;
}

class ListItem {
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
	Movie: MovieItem[];
}

export class ListDto {
	@Expose()
	@Type(() => ListItem)
	@ValidateNested()
	List: ListItem[];

	@Expose()
	@Type(() => MovieItem)
	@ValidateNested()
	Movie: MovieItem[];
}
