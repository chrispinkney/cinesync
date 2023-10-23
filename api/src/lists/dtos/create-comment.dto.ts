import { IsString } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	listId: string;

	@IsString()
	text: string;
}
