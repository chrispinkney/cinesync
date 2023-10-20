import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { MovieDto } from './movie.dto';

export class UpdateListDto {
	@IsString()
	listId: string;

	@IsOptional()
	@IsString()
	name: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieDto)
	Movie: MovieDto[];
}
