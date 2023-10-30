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
	releaseDate: string;

	@IsString()
	@IsOptional()
	posterUrl: string;

	@IsNumber()
	@IsOptional()
	rating: number;

	@IsString()
	@IsOptional()
	imdbId: string;
}
