import {
	IsString,
	IsArray,
	IsDate,
	IsNumber,
	IsOptional,
} from 'class-validator';

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

	@IsDate()
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
