import { Type } from 'class-transformer';
import {
	IsString,
	IsOptional,
	IsArray,
	ValidateNested,
	IsBoolean,
} from 'class-validator';
import { MovieDto } from './movie.dto';

export class UpdateListDto {
	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsBoolean()
	is_private: boolean;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieDto)
	Movie: MovieDto[];
}
