import { IsBoolean } from 'class-validator';

export class UpdateListPrivacyDto {
	@IsBoolean()
	isPrivate: boolean;
}
