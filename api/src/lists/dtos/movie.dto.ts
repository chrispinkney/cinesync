import { IsString, IsArray, IsInt, IsOptional } from 'class-validator';

export class MovieDto {
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsArray()
	@IsString({ each: true })
	genre: string[];

	@IsOptional()
	@IsInt()
	release_year?: number;
}
