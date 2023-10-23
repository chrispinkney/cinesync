import { Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CommentDto {
	@Expose()
	@IsString()
	id: string;

	@Expose()
	@IsString()
	username: string;

	@Expose()
	@IsString()
	text: string;

	@Expose()
	@IsDate()
	createdAt: Date;

	@Expose()
	@IsDate()
	updatedAt: Date;
}
