import { IsString } from 'class-validator';

export class UpdateCommentDto {
	// needed for guard authorization, see list.guard.ts
	@IsString()
	listId: string;

	@IsString()
	commentId: string;

	@IsString()
	text: string;
}
