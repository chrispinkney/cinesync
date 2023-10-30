import { IsArray, IsOptional, IsString } from 'class-validator';
import { MovieDto } from './movie.dto';

export class CreateListDto {
	@IsString()
	name: string;

	@IsOptional()
	@IsArray()
	movie: MovieDto[];
}
