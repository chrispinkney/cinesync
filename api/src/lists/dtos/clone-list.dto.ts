import { IsString } from 'class-validator';

export class CloneListDto {
	@IsString()
	name: string;

	@IsString()
	listId: string;
}
