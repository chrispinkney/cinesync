import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class MovieDto {
	@IsString()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	genre: string[];

	@IsString()
	@IsOptional()
	release_date: string;

	@IsString()
	@IsOptional()
	poster_url: string;

	@IsNumber()
	@IsOptional()
	rating: number;

	@IsString()
	@IsOptional()
	imdb_id: string;
}
